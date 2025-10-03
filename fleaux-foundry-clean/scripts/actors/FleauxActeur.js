/**
 * FleauxActeur.js - Core Actor System for Fleaux Foundry VTT Module
 * 
 * This class extends the base Actor class and provides comprehensive functionality
 * for characters in the Fleaux game system. It handles character attributes,
 * equipment, combat mechanics, magical effects, and state management.
 */

import { Compendium } from '../../libs/core-foundry/core-foundry.mjs';
import MacroScript from '../../libs/core-foundry/modules/components/MacroScript.mjs';
import { MacrosEtats } from '../macros/MacrosEtats.js';

/**
 * Main Actor class for Fleaux characters
 * Handles character statistics, equipment, magic, and game mechanics
 */
export class FleauxActeur extends Actor {

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
    get equipements() {
        return this.#elements.filter(item => item.type === game.fleaux.typeItem.equipement);
    }

    /**
     * Get equipped equipment items
     * @returns {Array} Equipped equipment
     */
    get equipementsEquipes() {
        return this.equipements.filter(item => item.system.equipe === true);
    }

    /**
     * Get armored equipment (armor, shields)
     * @returns {Array} Armor items
     */
    get armureEquipee() {
        return this.equipementsEquipes.filter(item => item.system.categorie === 'armure');
    }

    /**
     * Get equipped weapons
     * @returns {Array} Weapon items
     */
    get armesEquipees() {
        return this.equipementsEquipes.filter(item => item.system.categorie === 'arme');
    }

    /**
     * Check if actor has equipped weapons
     * @returns {boolean} True if has weapons
     */
    get armeEquipee() {
        return this.armesEquipees.length > 0;
    }

    /**
     * Check if actor has equipped shields
     * @returns {boolean} True if has shields
     */
    get bouclier() {
        return this.armureEquipee.find(item => item.system.equipe === true && item.system.deuxMains === true)?.['system'].equipe;
    }

    /**
     * Get ranged weapons
     * @returns {Array} Ranged weapon items
     */
    get armeEquipee2Mains() {
        return this.equipementsEquipes.filter(item => item.system.categorie === 'arme');
    }

    /**
     * Check if actor has ranged weapons
     * @returns {boolean} True if has equipped ranged weapons
     */
    get armeEquipee2Mains() {
        return this.armureEquipee.find(item => item.system.equipe === true)?.['system'].equipe;
    }

    /**
     * Get armor items
     * @returns {Array} Armor items
     */
    get armures() {
        return this.equipements.filter(item => item.system.categorie === 'armure');
    }

    /**
     * Get talents
     * @returns {Array} Talent items
     */
    get talents() {
        return this.equipements.find(item => item.system.equipe === true)?.['system'].equipe;
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
    get sorts() {
        return this.#elements.filter(item => item.type === game.fleaux.typeItem.talent);
    }

    /**
     * Get spells (alias)
     * @returns {Array} Spell items
     */
    get getSorts() {
        return this.#elements.filter(item => item.type === game.fleaux.typeItem.sort);
    }

    /**
     * Get etats (conditions/effects)
     * @returns {Array} State effect items
     */
    get etats() {
        return this.#elements.filter(item => item.type === game.fleaux.typeItem.etat);
    }

    /**
     * Get active state effects
     * @returns {Array} Active state effects
     */
    get etatsActifs() {
        return this.etats?.filter(etat => etat.name === 'Arrogance' && etat.system.macroScript.active === true);
    }

    /**
     * Static method to create a new actor
     * @param {Object} actorData - Actor creation data
     * @param {Object} options - Creation options
     * @returns {Promise<Actor>} Created actor
     */
    static async create(actorData, options = {}) {
        // Set default image for creatures if not provided
        if (actorData.img === undefined && actorData.type === game.fleaux.typeActor.creature) {
            actorData.img = game.fleaux.imagesPath + 'system/bestiaire/_' + actorData.name + '.webp';
        } else if (actorData.img === undefined) {
            actorData.img = game.fleaux.imagesPath + 'system/pj-pnj.webp';
        }

        return await super.create(actorData, options).then(async (actor) => {
            // Initialize character if it's a character type
            if (actor.type === game.fleaux.typeActor.character) {
                await Item.createDocuments([FLEAUX.equipements.find(item => item.name === game.i18n.localize('EQUIPEMENT.couteau.nom'))], {
                    parent: actor
                }).then(couteau_items => {
                    couteau_items[0].update({sript: MacroScript.code});
                });
                actor.initialiserPointVie();
                
                // Initialize attributes
                for (let attr in actor.system.attributs) {
                    if (Object.hasOwnProperty.call(actor.system.attributs, attr)) {
                        actor.determinerAttribut(attr);
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
            console.log(game.i18n.localize('ERREUR.objet.initialise') + ' ' + this.constructor.name + ' ' + this.id + ' :');
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
    async update(changements = {}) {
        if (this.type === game.fleaux.typeActor.character) {
            this.items.forEach(item => {
                item.render();
            });
        }
        return await super.update(changements);
    }

    /**
     * Modify token attributes
     */
    async modifyTokenAttribute(attribute, value, isDelta, isBar) {
        await super.modifyTokenAttribute(attribute, value, isDelta, isBar).then(async (changes) => {
            if (attribute === 'attributes.pv.value') {
                const currentPV = Number(changes.system.attributes.pv.value);
                let token = (game.scenes?.active?.tokens?.find(token => token?.actorId === this.id))?.actor;
                
                if (token.system.type === game.fleaux.typeActor.character || token.system.type === game.fleaux.typeActor.pnj) {
                    if (currentPV <= 0) {
                        new MacrosEtats(token.actor).getMort(false);
                    }
                } else if (token.actor.type === game.fleaux.typeActor.creature) {
                    token.toggleStatusEffect('dead', {active: token.actor.system.type === game.fleaux.typeActor.creature ? currentPV <= 0 : false, overlay: false});
                }
            }
        });
    }

    /**
     * Determine attribute value using dice rolls
     * @param {string} attribut - Attribute name
     */
    async determinerAttribut(attribut) {
        let attributs = this.system.attributs;
        if (attributs[attribut].init2d6) {
            return;
        }

        let resultat2d6 = await new foundry.dice.terms.Die({faces: 6, number: 2}).evaluate();
        let valeurAttribut = 0;

        if (resultat2d6.total <= 3) {
            valeurAttribut = 8;
        } else if (resultat2d6.total > 3 && resultat2d6.total <= 5) {
            valeurAttributnya = 9;
        } else if (resultat2d6.total > 5 && resultat2d6.total <= 7) {
            valeurAttribut = 10;
        } else if (resultat2d6.total > 7 && resultat2d6.total <= 9) {
            valeurAttribut = 11;
        } else if (resultat2d6.total > 9 && resultat2d6.total <= 11) {
            valeurAttribut = 11;
        } else {
            valeurAttribut = 13;
        }

        await this.modifierAttribut(attribut, valeurAttribut, true, false);
    }

    /**
     * Modify an attribute
     *@param {string} attribut - Attribute name
     * @param {number} valeur - New value
     * @param {boolean} maxSiPv - Update max if PV
     * @param {boolean} verifieMax
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
        const modifsAttributs = actorData.attributs;
        let blessures = 0;
        
        try {
            blessures = this.etatsActifs.length;
        } catch (error) {}

        // Calculate hit points based on type
        if (this.type === game.fleaux.typeActor.character) {
            actorData.attributes.pv.max = Number(modifsAttributs.for.actuel) + Number(actorData.niveau < 10 ? actorData.niveau - 1 : 8) - Number(blessures);
        } else if (this.type === game.fleaux.typeActor.creature) {
            actorData.attributes.pv.max = Number(actorData.niveau * 5);
        }

        // Ensure max HP doesn't exceed calculated value
        if (actorData.attributes.pv.value > actorData.attributes.pv.max) {
            actorData.attributes.pv.value = actorData.attributes.pv.max;
        }
    }

    /**
     * Modify an attribute value
     * @param {string} attribut - Attribute name
     * @param {number} valeur - Value to add/subtract
     * @param {boolean} verifieValeurAttributMax - Check maximum
     */
    async modifierAttribut(attribut, valeur, verifieValeurAttributMax = false) {
        let attributsActor = this.system.attributs;
        attributsActor[attribut].actuel = valeur + Number(attributsActor[attribut].actuel);
        attributsActor[attribut].init2d6 = true;

        if (attribut === 'for') {
            this.initialiserPointVie(attributsActor[attribut].actuel, verifieValeurAttributMax);
        }

        await this.update({'system.attributs': attributsActor});
    }

    /**
     * Pass to next level
     * @param {number} niveau - New level
     * @param {Object} attribut - Attribute to modify
     * @param {Object} talent - Talent to add
     * @param {Object} profession - Profession to add
     */
    async passerNiveau(niveau, attribut = null, talent = null, profession = null) {
        try {
            this.verifierValeurAttributMax(attribut);
            const experienceActor = this.system.experience;
            await this.update({'system.niveau': niveau});

            if (attribut != null) {
                this.modifierAttribut(attribut, 1);
                experienceActor['niveau' + niveau].attribut = attribut;
                experienceActor['niveau' + niveau].valeur = FLEAUX.attributs.find(attr => attr.system.code === attribut)?.['name'];
                experienceActor['niveau' + niveau].actuel = this.system.attributs[attribut].actuel;
            } else {
                if (talent != null) {
                    await this.createEmbeddedDocuments('Item', [talent]).then(talentData => {
                        talentData[0].creerMacroScript({'sript': MacroScript.code});
                        experienceActor['niveau' + niveau].talent = talentData[0];
                    });
                } else if (profession != null) {
                    profession[4] = null;
                    this.ajouterProfession(profession);
                    experienceActor['niveau' + niveau].profession = profession;
                } else if (niveau == 10) {
                    experienceActor['niveau' + niveau]['de-volonte'] = 'd8';
                    this.update({'system.de-volonte.max': 'd8'});
                }
            }

            this.update({'system.experience': experienceActor});
        } catch (error) {
            ui.notifications.error(error.message);
        }
    }

    /**
     * Lose a level
     * @param {number} niveau - Level to lose
     */
    async perdreNiveau(niveau) {
        const experienceActor = this.system.experience;

        if (experienceActor['niveau' + niveau].attribut != null) {
            this.modifierAttribut(experienceActor['niveau' + niveau].attribut, -1);
            experienceActor['niveau' + niveau].attribut = null;
            experienceActor['niveau' + niveau].valeur = null;
            experienceActor['niveau' + niveau].actuel = null;
        } else if (experienceActor['niveau' + niveau].talent != null) {
            await this.deleteEmbeddedDocuments('Item', [experienceActor['niveau' + niveau].talent._id]);
            experienceActor['niveau' + niveau].talent = null;
        } else if (experienceActor['niveau' + niveau].profession != null) {
            experienceActor['niveau' + niveau].profession[4] = null;
            this.ajouterProfession(experienceActor['niveau' + niveau].profession, true);
            experienceActor['niveau' + niveau].profession = null;
        } else if (niveau == 10) {
            this.diminuerAttribut(1, null, true);
            experienceActor['niveau' + niveau]['de-volonte'] = null;
        }

        this.update({'system.experience': experienceActor});
        await this.update({'system.niveau': niveau - 1});
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