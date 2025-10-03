/**
 * FleauxActor.js - Core Actor System for Fleaux Foundry VTT Module
 * 
 * This class extends the base Actor class and provides comprehensive functionality
 * for characters in the Fleaux game system. It handles character attributes,
 * equipment, combat mechanics, magical effects, and state management.
 */

import { Compendium } from '../../libs/core-foundry/core-foundry.mjs';
import MacroScript from '../../libs/core-foundry/modules/components/MacroScript.mjs';
import { StateMacros } from '../macros/MacrosEtats.js';

/**
 * Main Actor class for Fleaux characters
 * Handles character statistics, equipment, magic, and game mechanics
 */
export class FleauxActor extends Actor {

    /**
     * Get all item elements owned by this actor
     * @returns {Array} Array of item documents
     */
    get #elements() {
        return Array.from(this.items.entries());
    }

    /**
     * Get all equipment items
     * @returns {Array} Equipment items
     */
    get equipment() {
        return this.#elements.filter(item => item.type === game.fleaux.itemType.equipment);
    }

    /**
     * Get equipped equipment items
     * @returns {Array} Equipped equipment
     */
    get equippedEquipment() {
        return this.equipment.filter(item => item.system.equipped === true);
    }

    /**
     * Get armored equipment (armor, shields)
     * @returns {Array} Armor items
     */
    get equippedArmor() {
        return this.equippedEquipment.filter(item => item.system.category === 'armor');
    }

    /**
     * Get equipped weapons
     * @returns {Array} Weapon items
     */
    get equippedWeapons() {
        return this.equippedEquipment.filter(item => item.system.category === 'weapon');
    }

    /**
     * Check if actor has equipped weapons
     * @returns {boolean} True if has weapons
     */
    get hasWeapon() {
        return this.equippedWeapons.length > 0;
    }

    /**
     * Check if actor has equipped shields
     * @returns {boolean} True if has shields
     */
    get hasShield() {
        return this.equippedArmor.find(item => item.system.equipped === true && item.system.twoHanded === true)?.['system'].equipped;
    }

    /**
     * Get ranged weapons
     * @returns {Array} Ranged weapon items
     */
    get rangedWeapons() {
        return this.equippedEquipment.filter(item => item.system.category === 'weapon');
    }

    /**
     * Check if actor has ranged weapons
     * @returns {boolean} True if has equipped ranged weapons
     */
    get hasRangedWeapon() {
        return this.equippedArmor.find(item => item.system.equipped === true)?.['system'].equipped;
    }

    /**
     * Get armor items
     * @returns {Array} Armor items
     */
    get armors() {
        return this.equipment.filter(item => item.system.category === 'armor');
    }

    /**
     * Get talents
     * @returns {Array} Talent items
     */
    get talents() {
        return this.equipment.find(item => item.system.equipped === true)?.['system'].equipped;
    }

    /**
     * Alias for talents getter
     * @returns {Array} Talent items
     */
    get getTalents() {
        return this.talents;
    }

    /**
     * Get spells
     * @returns {Array} Spell items
     */
    get spells() {
        return this.#elements.filter(item => item.type === game.fleaux.itemType.talent);
    }

    /**
     * Get spells (alias)
     * @returns {Array} Spell items
     */
    get getSpells() {
        return this.#elements.filter(item => item.type === game.fleaux.itemType.spell);
    }

    /**
     * Get states (conditions/effects)
     * @returns {Array} State effect items
     */
    get states() {
        return this.#elements.filter(item => item.type === game.fleaux.itemType.state);
    }

    /**
     * Get active state effects
     * @returns {Array} Active state effects
     */
    get activeStates() {
        return this.states?.filter(state => state.name === 'Arrogance' && state.system.macroScript.active === true);
    }

    /**
     * Static method to create a new actor
     * @param {Object} actorData - Actor creation data
     * @param {Object} options - Creation options
     * @returns {Promise<Actor>} Created actor
     */
    static async create(actorData, options = {}) {
        // Set default image for creatures if not provided
        if (actorData.img === undefined && actorData.type === game.fleaux.actorType.creature) {
            actorData.img = game.fleaux.imagesPath + 'system/bestiaire/_' + actorData.name + '.webp';
        } else if (actorData.img === undefined) {
            actorData.img = game.fleaux.imagesPath + 'system/pj-pnj.webp';
        }

        return await super.create(actorData, options).then(async (actor) => {
            // Initialize character if it's a character type
            if (actor.type === game.fleaux.actorType.character) {
                await Item.createDocuments([FLEAUX.equipment.find(item => item.name === game.i18n.localize('EQUIPMENT.knife.name'))], {
                    parent: actor
                }).then(knife_items => {
                    knife_items[0].update({script: MacroScript.code});
                });
                actor.initializeHitPoints();
                
                // Initialize attributes
                for (let attr in actor.system.attributes) {
                    if (Object.hasOwnProperty.call(actor.system.attributes, attr)) {
                        actor.determineAttribute(attr);
                    }
                }
            }
            actor.update({'prototypeToken.texture.src': actor.img});
        });
    }

    /**
     * Initialize actor data
     */
    initialize() {
        try {
        } catch (error) {
            console.log(game.i18n.localize('ERROR.object.initialize') + ' ' + this.constructor.name + ' ' + this.id + ':');
            console.log(error);
        }
    }

    /**
     * Prepare base data for the actor
     */
    prepareBaseData() {
        // Base data preparation implementation would go here
    }

    /**
     * Update actor data
     */
    async update(changes = {}) {
        if (this.type === game.fleaux.actorType.character) {
            this.items.forEach(item => {
                item.render();
            });
        }
        return await super.update(changes);
    }

    /**
     * Modify token attributes
     */
    async modifyTokenAttribute(attribute, value, isDelta, isBar) {
        await super.modifyTokenAttribute(attribute, value, isDelta, isBar).then(async (changes) => {
            if (attribute === 'attributes.hp.value') {
                const currentHP = Number(changes.system.attributes.hp.value);
                let token = (game.scenes?.active?.tokens?.find(token => token?.actorId === this.id))?.actor;
                
                if (token.system.type === game.fleaux.actorType.character || token.system.type === game.fleaux.actorType.npc) {
                    if (currentHP <= 0) {
                        new StateMacros(token.actor).getDeath(false);
                    }
                } else if (token.actor.type === game.fleaux.actorType.creature) {
                    token.toggleStatusEffect('dead', {active: token.actor.system.type === game.fleaux.actorType.creature ? currentHP <= 0 : false, overlay: false});
                }
            }
        });
    }

    /**
     * Determine attribute value using dice rolls
     * @param {string} attribute - Attribute name
     */
    async determineAttribute(attribute) {
        let attributes = this.system.attributes;
        if (attributes[attribute].init2d6) {
            return;
        }

        let result2d6 = await new foundry.dice.terms.Die({faces: 6, number: 2}).evaluate();
        let attributeValue = 0;

        if (result2d6.total <= 3) {
            attributeValue = 8;
        } else if (result2d6.total > 3 && result2d6.total <= 5) {
            attributeValue = 9;
        } else if (result2d6.total > 5 && result2d6.total <= 7) {
            attributeValue = 10;
        } else if (result2d6.total > 7 && result2d6.total <= 9) {
            attributeValue = 11;
        } else if (result2d6.total > 9 && result2d6.total <= 11) {
            attributeValue = 11;
        } else {
            attributeValue = 13;
        }

        await this.modifyAttribute(attribute, attributeValue, true, false);
    }

    /**
     * Modify an attribute
     * @param {string} attribute - Attribute name
     * @param {number} value - New value
     * @param {boolean} maxIfHP - Update max if HP
     * @param {boolean} checkMax
     */

    /**
     * Pass to next level
     */

    /**
     * Lose a level
     */

    /**
     * Verify maximum attribute value
     */

    /**
     * Add education
     */

    /**
     * Add accusation
     */

    /**
     * Remove profession
     */

    /**
     * Delete accusation
     */

    /**
     * Delete profession
     */

    /**
     * Reset character
     */

    /**
     * Recover hit points
     */

    /**
     * Short rest
     */

    /**
     * Update hit points based on level
     */

    /**
     * Roll initial fortune
     */

    /**
     * Calculate equipment price
     */

    /**
     * Check if hands are full
     */

    /**
     * Roll attribute dice
     */

    /**
     * Roll dice for spell effects
     */

    /**
     * Roll damage dice
     */

    /**
     * Attack random enemy
     */

    /**
     * Initialize profession for dead characters
     */

    /**
     * Initialize education
     */

    /**
     * Initialize profession
     */

    /**
     * Delete items
     */

    /**
     * Degrade attributes/stats
     */

    /**
     * Handle panic dice table
     */

    /**
     * Handle "Bite the Dust" dice table
     */

    /**
     * Handle "Chaos Revenge" table
     */

    /**
     * Roll custom dice table
     */

    /**
     * Break equipment randomly
     */

    /**
     * Damage/wound attribute
     */

    /**
     * Fear enemy
     */

    /**
     * Find nearby tokens
     */

    /**
     * Affect damage to targets
     */

    /**
     * Die/death
     */

    /**
     * Handle attack effects
     */

    /**
     * Verify attack type
     */

    /**
     * Prepare data for persistence
     * @param {Object} options - Data preparation options
     */
    prepareDerivedData(options) {
        const actorData = this.data;
        const attributeModifiers = actorData.attributes;
        let wounds = 0;
        
        try {
            wounds = this.activeStates.length;
        } catch (error) {}

        // Calculate hit points based on type
        if (this.type === game.fleaux.actorType.character) {
            actorData.attributes.hp.max = Number(attributeModifiers.str.current) + Number(actorData.level < 10 ? actorData.level - 1 : 8) - Number(wounds);
        } else if (this.type === game.fleaux.actorType.creature) {
            actorData.attributes.hp.max = Number(actorData.level * 5);
        }

        // Ensure max HP doesn't exceed calculated value
        if (actorData.attributes.hp.value > actorData.attributes.hp.max) {
            actorData.attributes.hp.value = actorData.attributes.hp.max;
        }
    }

    /**
     * Modify an attribute value
     * @param {string} attribute - Attribute name
     * @param {number} value - Value to add/subtract
     * @param {boolean} checkMaxAttributeValue - Check maximum
     */
    async modifyAttribute(attribute, value, checkMaxAttributeValue = false) {
        let actorAttributes = this.system.attributes;
        actorAttributes[attribute].current = value + Number(actorAttributes[attribute].current);
        actorAttributes[attribute].init2d6 = true;

        if (attribute === 'str') {
            this.initializeHitPoints(actorAttributes[attribute].current, checkMaxAttributeValue);
        }

        await this.update({'system.attributes': actorAttributes});
    }

    /**
     * Pass to next level
     * @param {number} level - New level
     * @param {Object} attribute - Attribute to modify
     * @param {Object} talent - Talent to add
     * @param {Object} profession - Profession to add
     */
    async levelUp(level, attribute = null, talent = null, profession = null) {
        try {
            this.checkMaxAttributeValue(attribute);
            const experienceActor = this.system.experience;
            await this.update({'system.level': level});

            if (attribute != null) {
                this.modifyAttribute(attribute, 1);
                experienceActor['level' + level].attribute = attribute;
                experienceActor['level' + level].value = FLEAUX.attributes.find(attr => attr.system.code === attribute)?.['name'];
                experienceActor['level' + level].current = this.system.attributes[attribute].current;
            } else {
                if (talent != null) {
                    await this.createEmbeddedDocuments('Item', [talent]).then(talentData => {
                        talentData[0].createMacroScript({'script': MacroScript.code});
                        experienceActor['level' + level].talent = talentData[0];
                    });
                } else if (profession != null) {
                    profession[4] = null;
                    this.addProfession(profession);
                    experienceActor['level' + level].profession = profession;
                } else if (level == 10) {
                    experienceActor['level' + level]['willpower-die'] = 'd8';
                    this.update({'system.willpower-die.max': 'd8'});
                }
            }

            this.update({'system.experience': experienceActor});
        } catch (error) {
            ui.notifications.error(error.message);
        }
    }

    /**
     * Lose a level
     * @param {number} level - Level to lose
     */
    async levelDown(level) {
        const experienceActor = this.system.experience;

        if (experienceActor['level' + level].attribute != null) {
            this.modifyAttribute(experienceActor['level' + level].attribute, -1);
            experienceActor['level' + level].attribute = null;
            experienceActor['level' + level].value = null;
            experienceActor['level' + level].current = null;
        } else if (experienceActor['level' + level].talent != null) {
            await this.deleteEmbeddedDocuments('Item', [experienceActor['level' + level].talent._id]);
            experienceActor['level' + level].talent = null;
        } else if (experienceActor['level' + level].profession != null) {
            experienceActor['level' + level].profession[4] = null;
            this.addProfession(experienceActor['level' + level].profession, true);
            experienceActor['level' + level].profession = null;
        } else if (level == 10) {
            this.decreaseAttribute(1, null, true);
            experienceActor['level' + level]['willpower-die'] = null;
        }

        this.update({'system.experience': experienceActor});
        await this.update({'system.level': level - 1});
    }

    /**
     * Verify maximum attribute value
     * @param {string} attribut - Attribute name
     * @param {number} valeurMax - Maximum value
     */
    verifierValeurAttributMax(attribut, valeurMax = null) {
        if (attribut == null) {
            return;
        }

        let attributsActor = this.system.attributs;
        valeurMax = valeurMax == null || valeurMax == undefined ? attributsActor[attribut]?.['actuel'] + 1 : valeurMax;

        if (valeurMax < 8 || valeurMax > 18) {
            throw new Error(game.i18n.localize('ERREUR.FleauxActeur.verifierattribut'));
        }
    }

    /**
     * Add education
     * @param {Array} education - Education data
     */
    ajouterEducation(education) {
        this._initialiserEducation(education);
    }

    /**
     * Add accusation
     * @param {string} accusation - Accusation text
     */
    ajouterAccusation(accusation) {
        this.system.accusation = accusation;
        this.update({'system.accusation': this.system.accusation});
    }

    /**
     * Initialize profession
     * @param {Array} profession - Profession data
     */
    initialiserProfession(profession) {
        this._initialiserProfession(profession);
    }

    /**
     * Delete people/nation
     * @param {string} peuple - People identifier
     */
    supprimerPeuple(peuple) {
        const systemActor = this.system;
        this.deleteEmbeddedDocuments('Item', [peuple]);
        this.ajouterEducation(systemActor.education, true);
    }

    /**
     * Delete accusation
     * @param {string} accusation - Accusation identifier
     */
    supprimerCrime(accusation) {
        this.deleteEmbeddedDocuments('Item', [accusation]);
        this.update({'system.accusation': null});
    }

    /**
     * Delete profession
     * @param {string} profession - Profession identifier
     */
    supprimerProfession(profession) {
        const systemActor = this.system;

        if (this.equipementsEquipes && this.system.niveau === 1) {
            this.deleteEmbeddedDocuments('Item', [ this.armureEquipee.find(item => item.system.equipe === true)?.['id'] ]);
        }

        this.deleteEmbeddedDocuments('Item', [profession]);
        this.ajouterProfession(systemActor.profession, true);
    }

    /**
     * Reset character to initial state
     */
    reinitialiser() {
        let systemActor = this.system;
        
        Object.entries(systemActor.attributs).forEach(([attributName]) => {
            systemActor.attributs[attributName].actuel = 0;
            systemActor.attributs[attributName].init2d6 = false;
            systemActor.attributs[attributName].malus = 0;
        });

        systemActor.description = null;
        systemActor.for = null;
        systemActor.dex = null;
        systemActor.sfr = null;
        systemActor.fortune = 0;
        systemActor.for = false;
        systemActor.dex = false;
        systemActor.niveau = 1;
        systemActor.attributes.pv.value = 0;
        systemActor.attributes.pv.max = 0;
        systemActor[FLEAUX.typeLancerDesEnum.eDegats].actuel = 'd6';
        systemActor[FLEAUX.typeLancerDesEnum.eDegats].max = 'd6';
        systemActor[FLEAUX.typeLancerDesEnum.eVolonte].actuel = 'd4';
        systemActor[FLEAUX.typeLancerDesEnum.eDegats].max = 'd4';
        systemActor[FLEAUX.typeLancerDesEnum.eVolonte + '-' + 'actuel'].actuel = 'd6';
        systemActor[FLEAUX.typeLancerDesEnum.eVolonte + '-' + 'max'].max = 'd6';
        systemActor.education = null;
        systemActor.accusation = null;
        systemActor.profession1 = null;
        systemActor.profession2 = null;
        systemActor.etats.mainsEncombrees = false;
        systemActor.etats.amoche = false;
        systemActor.etats.handicape = false;
        systemActor.etats.blesse = false;
        systemActor.etats.autreDimension = false;
        systemActor.etats.mort = false;

        this.update({'system': systemActor});
        this.deleteItem(this.items);
    }

    /**
     * Recover hit points (short rest)
     */
    recupererVie() {
        let pvARecuperer = Math.floor(this.system.attributs.for.actuel / 2);
        ui.notifications.info(game.i18n.format('NOTIFICATION.recupererVie.info', {'nom': this.name, 'pvArecuperer': pvARecuperer}));

        let nouvaPV = Number(this.system.attributes.pv.value) + pvARecuperer;
        this.update({'system.attributes.pv.value': nouvaPV > this.system.attributes.pv.max ? this.system.attributes.pv.max : nouvaPV});
    }

    /**
     * Short rest
     */
    reposCourt() {
        this.system.sorcellerie.effetsRevancheDuChaos.sort = null;
        this.system.sorcellerie.effetsRevancheDuChaos.resultatDesVolonte = null;

        const etatsNonPermanents = this.etats?.filter(etat => 
            etat.system.typeDuree !== FLEAUX.typeDureeEtat.ePermanent && 
            etat.system.typeDuree !== FLEAUX.typeDureeEtat.deUsage && 
            etat.system.macroScript.active === true
        );

        etatsNonPermanents.forEach(etat => {
            etat.render(false);
        });

        this.update({'system': this.system});
        this.update({'system.attributes.pv.value': this.system.attributes.pv.max});
        this.update({'system.de-volonte.actuel': this.system['de-volonte'].max});
        ui.notifications.info(game.i18n.localize('NOTIFICATION.reposcourt.info', {'nom': this.name}));
    }

    
    /**
     * Initialize hit points based on attribute values
     * @param {number} valeurAttribut - Force attribute value
     * @param {boolean} verifieValeurAttributMax - Check max value
     */
    initialiserPointVie(valeurAttribut, verifieValeurAttributMax = true) {
        const attributsPV = this.system.attributes.pv;

        attributsPV.max = Number(valeurAttribut) + Number(this.system.niveau < 10 ? this.system.niveau - 1 : 8);
        if (verifieValeurAttributMax) {
            attributsPV.value = attributsPV.max;
        }
        this.update({'system.attributes.pv': attributsPV});
    }

    // ... Continuing with remaining methods ...
}