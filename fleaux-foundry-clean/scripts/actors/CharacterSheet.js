/**
 * CharacterSheet.js - Character Sheet for Fleaux Foundry VTT Module
 * 
 * Actor sheet handling for character players. Provides
 * interactive character sheet with tabs for various character elements.
 */
import MacroScript from '../../libs/core-foundry/modules/components/MacroScript.mjs';
import { StateMacros } from '../macros/MacrosEtats.js';

/**
 * Character sheet class for character actors
 * Provides interactive UI for character management
 */
export class CharacterSheet extends ActorSheet {

    /**
     * Get default sheet options
     * @returns {Object} Sheet configuration
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            'classes': game.fleaux.actorClasses,
            'template': game.fleaux.templatesActorsPath + 'character-sheet.hbs',
            'width': 950,
            'height': 'auto',
            'tabs': [{'navSelector': '.sheet-tabs', 'contentSelector': '.sheet-body', 'initial': 'tabEquipment'}]
        });
    }

    /**
     * Get tab configuration for character sheet
     * @returns {Array} Tab definitions
     */
    get tabs() {
        return [
            {'name': game.i18n.localize('EQUIPMENT'), 'style': 'flex: 2; text-align: center;'},
            {'name': game.i18n.localize('CHAT.rollAttributes.difficulty.title'), 'style': 'flex: 2; text-align: center;'},
            {'name': game.i18n.localize('FORM.character.tab.states'), 'style': 'flex: 2; text-align: center;'}
        ];
    }

    /**
     * Get resource columns configuration
     * @returns {Array} Resource column definitions
     */
    get colTalents() {
        return [
            {'name': '-' + game.i18n.localize('FORM.character.label.talents').toUpperCase() + ' [ ' + this.actor.talents?.length + ' ]', 'style': 'flex: 10; align-items: center; cursor: pointer;'},
            {'name': 'Date', 'style': 'flex: 2; text-align: center;'},
            {'name': game.i18n.localize('FORM.character.label.active'), 'style': 'flex: 2; text-align: center;'},
            {'name': game.i18n.localize('FORM.character.label.slot'), 'style': 'flex: 4; text-align: center; cursor: pointer;'}
        ];
    }

    /**
     * Get experience column definition
     * @returns {Array} Experience column
     */
    get colExperience() {
        return [
            {'name': 'EXP' + this.actor.system?.niveau + ' ]', 'style': 'display: flex; flex: 1; align-items: center; cursor: pointer;'}
        ];
    }

    /**
     * Get spells column definition
     * @returns {Array} Spells column
     */
    get colSorts() {
        return [
            {'name': '-' + game.i18n.localize('FORMULAIRE.personnage.libelle.sorts').toUpperCase() + ' [ ' + this.actor.sorts?.length + ' ]', 'style': 'display: flex; flex: 10; align-items: center; cursor: pointer;'}
        ];
    }

    /**
     * Get weapons (armes) columns
     * @returns {Array} Weapons column definitions
     */
    get colArmes() {
        let colonnesBase = [
            {'name': '-' + game.i18n.localize('FORMULAIRE.personnage.libelle.armes').toUpperCase() + ' [ ' + this.actor.armes?.length + ' ]', 'style': 'flex: 3; text-align: center; cursor: pointer;'},
            {'name': game.i18n.localize('FORMULAIRE.equipement.libelle.typeattaque'), 'style': 'flex: 2; text-align: center;'},
            {'name': game.i18n.localize('FORMULAIRE.commun.libelle.emplacement'), 'style': 'flex: 2; text-align: center;'}
        ];
        
        this.tabs.forEach(tabConfig => {
            colonnesBase.push(tabConfig);
        });
        
        return colonnesBase;
    }

    /**
     * Get armor columns
     * @returns {Array} Armor column definitions
     */
    get colArmures() {
        let colonnesBase = [
            {'name': '-' + game.i18n.localize('FORMULAIRE.personnage.libelle.armures').toUpperCase() + ' [ ' + this.actor.armures?.length + ' ]', 'style': 'flex: 8; text-align: center; cursor: pointer;'},
            {'name': game.i18n.localize('FORMULAIRE.commun.libelle.protection'), 'style': 'flex: 2; text-align: center;'}
        ];
        
        this.tabs.forEach(tabConfig => {
            colonnesBase.push(tabConfig);
        });
        
        return colonnesBase;
    }

    /**
     * Get objects columns
     * @returns {Array} Objects column definitions
     */
    get colObjets() {
        let colonnesBase = [
            {'name': '-' + game.i18n.localize('FORMULAIRE.personnage.libelle.objets').toUpperCase() + ' [ ' + this.actor.objets?.length + ' ]', 'style': 'display: flex; flex: 3; align-items: center; cursor: pointer;'},
            {'name': '', 'style': 'flex: 2; text-align: center;'},
            {'name': game.i18n.localize('FORMULAIRE.commun.libelle.emplacement'), 'style': 'flex: 2; text-align: center;'}
        ];
        
        this.tabs.forEach(tabConfig => {
            colonnesBase.push(tabConfig);
        });
        
        return colonnesBase;
    }

    /**
     * Generate data for template rendering
     * @param {Object} options - Rendering options
     * @returns {Object} Template data
     */
    getData(options) {
        const dataSuper = super.getData(options);
        const actorData = dataSuper.actor;

        dataSuper.colArmes = this.colArmes;
        dataSuper.colArmures = this.colArmures;
        dataSuper.colObjets = this.colObjets;
        dataSuper.colTalents = this.colTalents;
        dataSuper.colExperience = this.colExperience;
        dataSuper.colSorts = this.colSorts;
        dataSuper.FLEAUX = FLEAUX;
        
        dataSuper.education = dataSuper.items.filter(item => item.type === 'education');
        dataSuper.accusations = dataSuper.items.filter(item => item.type === 'crime');
        dataSuper.professions = dataSuper.items.filter(item => item.type === 'profession');
        dataSuper.armes = actorData.armes;
        dataSuper.armures = actorData.armures;
        dataSuper.objets = actorData.objets;
        dataSuper.etats = actorData.etats;
        dataSuper.talents = actorData.talents;
        dataSuper.sorts = actorData.sorts;
        dataSuper.experience = actorData.experience;

        dataSuper.actor = actorData;
        
        return dataSuper;
    }

    /**
     * Activate event listeners for the sheet
     * @param {HTMLHtmlElement} html - Sheet HTML element
     */
    activateListeners(html) {
        super.activateListeners(html);

        // Only enable interactions for sheet owner
        if (!this.actor.isOwner) {
            return;
        }

        // Prevent actions if character is dead
        if (this.actor.system.attributes.pv.value <= 0 && this.actor.system.attributs.for.init2d6 === true) {
            return;
        }

        // Tab toggle functionality
        html.find('.toggle-header').on('click', event => {
            event.preventDefault();
            let headerElement = $(event.currentTarget);
            let headerSetting = game.settings.get(game.system.id + '.' + headerEntity.attr('data-item-id'));
            
            headerElement.attr('data-open') === '1' ? 
                (headerElement.attr('data-open', '0'), headerSetting.apps[0].close()) : 
                (headerElement.attr('data-open', '1'), headerSetting.render(true));
        });

        // Reset character button
        html.find('.reinitialiser').on('click').then(() => {
            return Dialog.confirm({
                'title': game.i18n.localize('DIALOGUE.reinitialiser.titre'),
                'content': game.i18n.format('DIALOGUE.reinitialiser.contenu', {'nom': this.actor.name}),
                'yes': () => {
                    this.actor.reinitialiser();
                    ui.notifications.info(game.i18n.format('NOTIFICATION.reinitialiser.info', {'nom': this.actor.name}));
                },
                'defaultYes': false
            });
        });

        // Recovery dialog
        html.find('.recuperation').on('click', event => {
            let recovDialog = new Dialog({
                'title': game.i18n.localize('DIALOGUE.recuperation.titre'),
                'content': game.i18n.format('DIALOGUE.recuperation.contenu', {'nom': this.actor.name}),
                'buttons': {
                    'reposcourt': {
                        'label': game.i18n.localize('DIALOGUE.recuperation.bouton.reposcourt'),
                        'callback': () => {
                            this.actor.reposCourt();
                        }
                    },
                    'reposlong': {
                        'label': game.i18n.localize('DIALOGUE.recuperation.bouton.reposlong'),
                        'callback': () => {
                            this.actor.reposLong();
                        }
                    }
                },
                'default': 'reposcourt'
            });
            recovDialog.render(true);
        });

        // Dice rolling buttons
        html.find('.roll-des-usage').on('click', event => {
            event.preventDefault();
            let target = $(event.currentTarget);
            let itemName = target.data('item-name');
            let itemId = target.attr('data-item-id');
            
            const parentElement = target.parents('.items-list');
            let itemActor = this.actor.items.get(parentElement.attr('data-item-id'));

            if (itemId === FLEAUX.deUsageEnum.deUsage || itemId === FLEAUX['deUsageEnum'].deVolonte) {
                this.actor.lancerDesUsage(itemName, itemId);
            } else if (itemId === FLEAUX.deUsageEnum.deDegats) {
                if (itemActor) {
                    itemActor.lancerDesDegats(game.i18n.format('DIALOGUE.deusage.titre', {'nom': itemActor.name}), itemId);
                }
            } else {
                this.actor.lancerDesAttributs(itemName, itemActor?.type === game.fleaux.typeItem.equipement ? itemActor : null);
            }
        });

        // Attribute change handlers
        html.find('.attribut-change').change(event => {
            event.preventDefault();
            let inputElement = $(event.currentTarget);
            let attributName = inputElement.attr('data-attribut');
            
            try {
                this.actor.modifierAttribut(attributName, Number(inputElement.get(0).value));
                if (attributName === 'for') {
                    this.actor.initialiserPointVie(inputElement.get(0).value, true);
                }
            } catch (error) {
                inputElement.get(0).value = this.actor.system.attributs[attributName].actuel;
                ui.notifications.warn(error.message);
            }
        });

        // Education dice rolling
        html.find('.educations-d6').on('click', event => {
            this._surClickEduCriPro(event);
        });

        // Accusation dice rolling
        html.find('.accusations').on('click', event => {
            this._surClickEduCriPro(event);
        });

        html.find('.professions').on('click', event => {
            this._surClickEduCriPro(event);
        });

        // Delete buttons for people/profession/accusation
        html.find('.peuple-delete').on('click', event => {
            return Dialog.confirm({
                'title': game.i18n.localize('DIALOGUE.supprimerpeuple.titre'),
                'content': game.i18n.format('DIALOGUE.supprimerpeuple.contenu', {'nom': this.actor.name}),
                'yes': () => {
                    return ui.notifications.info(game.i18n.format('NOTIFICATION.supprimerpeuple.info', {'nom': this.actor.name})),
                    this.actor.supprimerPeuple(idElement);
                },
                'defaultYes': false
            });
        });

        html.find('.profession-delete').on('click', event => {
            return Dialog.confirm({
                'title': game.i18n.localize('DIALOGUE.supprimerprofession.titre'),
                'content': game.i18n.format('DIALOGUE.supprimerprofession.contenu', {'nom': this.actor.name}),
                'yes': () => {
                    return ui.notifications.info(game.i18n.format('NOTIFICATION.supprimerprofession.info', {'nom': this.actor.name})),
                    this.actor.supprimerProfession(idElement);
                },
                'defaultYes': false
            });
        });

        html.find('.crime-delete').on('click', event => {
            return Dialog.confirm({
                'title': game.i18n.localize('DIALOGUE.supprimercrime.titre'),
                'content': game.i18n.format('DIALOGUE.supprimercrime.contenu', {'nom': this.actor.name}),
                'yes': () => {
                    return ui.notifications.warn(game.i18n.format('NOTIFICATION.supprimercrime.info', {'nom': this.actor.name})),
                    this.actor.supprimerCrime(idElement);
                },
                'defaultYes': false
            });
        });

        // Melee attack button
        html.find('.mel-attaque').on('click', event => {
            const attributName = event.currentTarget.dataset.attr;
            
            if (attributName === 'mel') {
                let attackDialog = new Dialog({
                    'title': game.i18n.localize('DIALOGUE.attaqueoudefence.titre'),
                    'content': game.i18n.localize('DIALOGUE.attaqueoudefence.contenu'),
                    'seDefendre': null,
                    'buttons': {
                        'attaquer': {
                            'label': game.i18n.localize('DIALOGUE.attaqueoudefence.bouton.attaque'),
                            'callback': () => {
                                if (attackDialog.data.seDefendre === null) {
                                    attackDialog.data.seDefendre = false;
                                }
                                this.actor.lancerDesAttributs(attributName, false, false);
                            }
                        },
                        'parer': {
                            'label': game.i18n.localize('DIALOGUE.attaqueoudefence.bouton.parade'),
                            'callback': () => {
                                if (attackDialog.data.seDefendre === null) {
                                    attackDialog.data.seDefendre = true;
                                }
                                if (this.actor.system.bouclier || this.actor.armeEquipee) {
                                    this.actor.lancerDesAttributs(attributName, false, true);
                                } else {
                                    ui.notifications.warn(game.i18n.format('NOTIFICATION.attaqueoudefence.doitetreequipe.avertissement', {'nom': this.actor.name}));
                                }
                            }
                        }
                    },
                    'default': 'for',
                    'close': () => {
                        attackDialog.data.seDefendre === null && 
                        (ui.notifications.warn(game.i18n.format('NOTIFICATION.attaqueoudefence.doitchoisir.avertissement', {'nom': this.actor.name})), 
                        attackDialog.render(true));
                    }
                });
                attackDialog.render(true);
            } else if (attributName === 'sfr') {
                let sangFroidDialog = new Dialog({
                    'title': game.i18n.localize('DIALOGUE.sangfroid.titre'),
                    'content': game.i18n.localize('DIALOGUE.sangfroid.contenu'),
                    'buttons': {
                        'normal': {
                            'label': game.i18n.localize('DIALOGUE.sangfroid.bouton.normal'),
                            'callback': () => {
                                this.actor.lancerDesAttributs(attributName, false);
                            }
                        },
                        'peur': {
                            'label': game.i18n.localize('DIALOGUE.sangfroid.bouton.peur'),
                            'callback': () => {
                                this.actor.lancerDesAttributs(attributName, false, false, true);
                            }
                        },
                        'initiative': {
                            'label': game.i18n.localize('DIALOGUE.sangfroid.bouton.initiative'),
                            'callback': () => {
                                this.actor.lancerDesAttributs(attributName, true);
                            }
                        }
                    },
                    'default': 'for'
                });
                sangFroidDialog.render(true);
            } else {
                this.actor.lancerDesAttributs(attributName);
            }
        });

        // Fortune calculator using click binding
        html.find('.calculer-fortune').on('click', this.calculerFortune.bind(this));

        // Item editing buttons
        html.find('.item-edit').on('click', event => {
            const itemContainer = $(event.currentTarget).parents('.items-box');
            const itemDocument = this.actor.items.find(itemContainer.attr('data-item-id'));
            itemDocument.sheet.render(true);
        });

        html.find('.item-delete').on('click', event => {
            Dialog.confirm({
                'title': game.i18n.localize('DIALOGUE.supprimerelement.titre'),
                'content': game.i18n.localize('DIALOGUE.supprimerelement.contenu'),
                'yes': () => {
                    const itemContainer = $(event.currentTarget).parents('.items-box');
                    if (itemContainer) {
                        let itemActor = this.actor.items.find(itemContainer.data('item-id'));
                        itemActor.delete(), 
                        this.actor.deleteEmbeddedDocuments('Item', [itemActor.id]), 
                        itemContainer.slideUp(200, () => this.render(false));
                    }
                },
                'no': () => {},
                'defaultYes': false
            });
        });

        // Drag and drop
        html.find('.items-header div').on('click', event => this._onHeaderSummary(event));
        html.find('.editor-header').on('click', event => this._onEditorHeaderSummary(event));

        // Reset character
        html.find('.reinitialiser').on('click', event => {
            return Dialog.confirm({
                'title': game.i18n.localize('DIALOGUE.reinitialiser.titre'),
                'content': game.i18n.format('DIALOGUE.reinitialiser.contenu', {'nom': this.actor.name}),
                'yes': () => {
                    this.actor.reinitialiser();
                    ui.notifications.info(game.i18n.format('NOTIFICATION.reinitialiser.info', {'nom': this.actor.name}));
                },
                'defaultYes': false
            });
        });

        // Calculate equipment price
        html.find('.calculer-prix-equipement').on('click', event => {
            return Dialog.confirm({
                'title': game.i18n.localize('DIALOGUE.calculerprix.titre'),
                'content': game.i18n.format('DIALOGUE.calculerprix.contenu', {'nom': itemName}),
                'yes': () => {
                    this.actor.calculerPrixEquipement(itemData.dataSet.itemName);
                },
                'defaultYes': false
            });
        });

        // Usage dice change handling
        html.find('.des-usage').change(event => {
            const targetSelect = $(event.currentTarget);
            const itemContainer = targetSelect?.parents('.items-box');
            
            if (itemContainer) {
                let itemActor = this.actor.items.find(itemContainer.attr('data-item-id'));
                const usageDie = targetSelect.parents('.item-summary')?.length('.roll-des-usage')?.data('value');
                
                if (itemActor) {
                    if (itemActor.verifierDesUsage(targetSelect[0].value, usageDie)) {
                        itemActor = foundry.utils.mergeObject(itemActor);
                        itemActor.system.deUsage.actuel = targetSelect[0].value;
                        
                        const itemUpdateData = {'_id': itemActor._id, 'system': itemActor.system};
                        this.actor.updateEmbeddedDocuments('Item', [itemUpdateData]).then(resultData => {
                            if (targetSelect[0].value === '0') {
                                resultData[0].estEquipable();
                            }
                        });
                    } else {
                        ui.notifications.warn(game.i18n.localize('NOTIFICATION.deusage.controle.erreur'));
                    }
                }
            }
            return;
        });

        // Roll usage dice
        html.find('.roll-des-usage').on('click', event => {
            const itemContainer = $(event.currentTarget).parents('.items-box');
            if (itemContainer) {
                let itemActor = this.actor.items.get(itemContainer.data('item-id'));
                itemActor.roll();
            }
        });

        // Equip/unequip toggle
        html.find('.bouclier').on('click', event => {
            const checkbox = $(event.currentTarget)[0];
            if (checkbox.checked) {
                this.actor.system.bouclier = checkbox.checked;
                this?.actor?.verifierValeurAttributMax() && 
                (ui.notifications.warn(game.i18n.localize('NOTIFICATION.estEquipable.mainindisponible.erreur')), 
                checkbox.checked = !checkbox.checked);
            }
        });

        // Execute macro scripts
        html.find('.macroScript').on('click', event => {
            const itemContainer = $(event.currentTarget).parents('.items-list');
            if (itemContainer) {
                let itemActor = this.actor.items.get(itemContainer.attr('item-id'));
                itemActor.executerMacroScript();
            }
        });

        // Handle hit point changes for death
        html.find('.pv-actuel').change(async event => {
            const targetInput = $(event.currentTarget)[0];
            if (Number(targetInput?.value) <= 0) {
                await new MacrosEtats(this.actor).getMort();
            }
        });

        // Level up
        html.find('.passage-niveau').on('click', async event => {
            let currentLevel = this.actor.system.niveau + 1;
            let levelTitle = game.i18n.format('DIALOGUE.passageniveau.titre', {'niveau': currentLevel});
            let levelContent = null;
            let attributChoice = null;
            let dialogButtons = {};
            let defaultValue = 'for';
            let dialogWidth = 300;

            if (currentLevel == 2 || currentLevel == 4 || currentLevel == 6 || currentLevel == 8) {
                attributChoice = game.i18n.localize('DIALOGUE.passageniveau.attribut.contenu');
                dialogButtons = {
                    'for': {'label': game.i18n.localize('ATTRIBUT.force.nom'), 'callback': () => {
                        this.actor.passerNiveau(currentLevel, 'for');
                    }},
                    'dex': {'label': game.i18n.localize('ATTRIBUT.dexterite.nom'), 'callback': () => {
                        this.actor.passerNiveau(currentLevel, 'dex');
                    }},
                    'eru': {'label': game.i18n.localize('ATTRIBUT.erudition.nom'), 'callback': () => {
                        this.actor.passerNiveau(currentLevel, 'eru');
                    }},
                    'cha': {'label': game.i18n.localize('ATTRIBUT.charisme.nom'), 'callback': () => {
                        this.actor.passerNiveau(currentLevel, 'cha');
                    }},
                    'sfr': {'label': game.i18n.localize('ATTRIBUT.sang-froid.nom'), 'callback': () => {
                        this.actor.passerNiveau(currentLevel, 'sfr');
                    }},
                    'mel': {'label': game.i18n.localize('ATTRIBUT.melee.nom'), 'callback': () => {
                        this.actor.passerNiveau(currentLevel, 'mel');
                    }},
                    'tir': {'label': game.i18n.localize('ATTRIBUT.tir.nom'), 'callback': () => {
                        this.actor.passerNiveau(currentLevel, 'tir');
                    }}
                };
                defaultValue = 'for';
                dialogWidth = 600;
            }
            // Continue with level 3,5,7,9 handling...

            if (levelTitle != null) {
                let levelDialog = new Dialog({
                    'title': levelTitle,
                    'content': levelContent,
                    'buttons': dialogButtons,
                    'default': defaultValue
                });
                levelDialog.render(true, {'width': dialogWidth, 'height': 150});
            }
        });

        // Level down
        html.find('.caracteristiques-acteurs').on('click', async event => {
            let currentLevel = this.actor.system.niveau;
            if (currentLevel > 1) {
                let levelDialog =new Dialog({
                    'title': game.i18n.format('DIALOGUE.perteniveau.titre', {'niveau': currentLevel}),
                    'content': game.i18n.localize('DIALOGUE.perteniveau.contenu'),
                    'buttons': {
                        'valider': {'label': game.i18n.localize('DIALOGUE.experience.bouton.valider'), 'callback': () => {
                            this.actor.perdreNiveau(currentLevel);
                        }}
                    },
                    'defaut': 'for'
                });
                levelDialog.render(true, {'width': 300, 'height': 150});
            } else {
                ui.notifications.warn(game.i18n.format('NOTIFICATION.niveauminimum.avertissement', {'nom': this.actor.name}));
                return;
            }
        });

        // Show experience dialog
        html.find('.niveau-experience').click(async event => {
            const deVolonteActor = this.actor.system['de-volonte'];
            const templatesDialoguesChemin = game.fleaux.imagesPath + 'niveau-experience.hbs';
            
            let experienceDialog = new Dialog({
                'title': game.i18n.format('DIALOGUE.experience.titre', {'nom': this.actor.name}),
                'buttons': {},
                'content': await renderTemplate(templatesDialoguesChemin, {
                    'experience': deVolonteActor,
                    'profession': deVolonteActor?.system?.profession ? deVolonteActor.system.profession[1] : ''
                })
            });
            experienceDialog.render(true, {'width': 600, 'height': 360});
        });
    }

    /**
     * Choose attribute for education
     */
    async _choisirAttributEducation(education) {
        let attributEducation = education ? education[3].toLowerCase() : null;
        const dialogTitle = game.i18n.localize('DIALOGUE.choisirattribut.titre');
        const dialogContent = game.i18n.localize('DIALOGUE.choisirattribut.contenu');

        if (attributEducation === 'meltir') {
            // Handle mel/tir choice...
        } else if (attributEducation === 'auchoix') {
            // Handle flexible choice...
        } else {
            this.actor.ajouterEducation(education);
        }
    }

    /**
     * Handle education/crime/profession dice clicks
     */
    async _surClickEduCriPro(event) {
        event.preventDefault();
        const categoryType = 'peuple';
        const crimeType = 'accusation'; 
        const professionType = 'profession';
        
        let elementId = event.currentTarget.parentElement.dataset.itemName?.replace('select-', '');
        let isAutoRoll = event.currentTarget.dataset.action;
        const elementActor = this.actor.items.find(item => item.name === elementId);
        const elementType = this.actor.system[elementId === categoryType ? 'education' : elementId === crimeType ? 'accusation' : 'profession'] || null;

        if (elementActor && elementType === null) {
            let diceFormula = elementActor.system.de;
            if (isAutoRoll === 'false') {
                let diceResult = await new foundry.dice.terms.Die({
                    faces: parseInt(diceFormula.split('d')[1]),
                    number: parseInt(diceFormula.split('d')[0])
                }).evaluate();
                
                if (elementId === categoryType) {
                    await this._choisirAttributEducation(elementActor.system.education[diceResult?.total - 1]);
                } else if (elementId === crimeType) {
                    this.actor.supprimerCrime(elementActor.system.crime[diceResult?.total - 1]);
                } else if (elementId === professionType) {
                    this.actor.ajouterProfession(elementActor.system.profession[diceResult?.total - 1]);
                }
            } else {
                // Manual selection dialog...
            }
        } else {
            // Error handling...
        }
    }

    /**
     * Handle drop events
     */
    async _onDrop(event) {
        event.preventDefault();
        try {
            const data = JSON.parse(event.dataTransfer.getData('text/plain'));
            if (data.type === 'Item') {
                return this._onDropItemCreate(event, data);
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    /**
     * Handle item drop creation
     */
    async _onDropItemCreate(event, itemData) {
        const fleauxTypeItem = game.fleaux.typeItem;
        
        if (!this.actor.isOwner || itemData.type === fleauxTypeItem.equipement) {
            return false;
        }

        // Check for duplicate items...
        if (itemData.type === fleauxTypeItem.equipement && this.actor.items.find(item => item.img === itemData.img) ||
            itemData.type === fleauxTypeItem.talent && this.actor.items.find(item => item.img === itemData.img) ||
            itemData.type === fleauxTypeItem.accusation && this.actor.items.find(item => item.type === fleauxTypeItem.accusation) ||
            itemData.type === fleauxTypeItem.profession && this.actor.items.find(item => item.type === fleauxTypeItem.profession) ||
            itemData.type === fleauxTypeItem.profession && this.actor.items.find(item => item.type === fleauxTypeItem.profession)[0]) {
            ui.notifications.warn(game.i18n.format('NOTIFICATION.typeexistedeja.avertissement', {'nom': this.actor.name, 'type': game.i18n.localize('TYPES.Item.' + itemData.type)}));
        } else {
            return super._onDrop(event).then(createdItems => {
                this.actor.items.add(itemData.name);
                createdItems[0].update({'script': game.i18n.localize(createdItems?.['system']?.['macroScript']?.['idMacro'])?.['command'])});
            });
        }
    }

    /**
     * Calculate fortune for character
     */
    calculerFortune(event) {
        event.preventDefault();
        const dataTransfer = event.currentTarget.dataset;
        const itemActorData = foundry.utils.mergeObject(dataTransfer.itemData);
        
        let imagePath = '';
        let displayName = game.fleaux.imagesPath + 'system/' + game.fleaux.typeItem[itemActorData.type] + '/' + game.fleaux.typeItem[itemActorData.type] + '/' + itemActorData.name + '.webp';
        
        if (itemActorData.type === game.fleaux.typeItem.equipement || itemActorData.type === game.fleaux.typeItem.talent) {
            displayName = game.i18n.localize('FORMULAIRE.equipement.libelle') + ' ' + game.i18n.localize('TYPES.Item.' + itemActorData.type);
        } else if (itemActorData.type === game.fleaux.typeItem.etat) {
            displayName = game.i18n.localize('FORMULAIRE.personnage.libelle.equiper') + ' ' + game.i18n.localize('TYPES.Item.' + itemActorData.type);
        } else if (itemActorData.type === game.fleaux.typeItem.commun) {
            imagePath = game.fleaux.imagesPath + 'system/' + game.fleaux.typeItem[itemActorData.categorie] + '/' + itemActorData.categorie + '.webp';
            itemActorData.emplacement = itemActorData.categorie === 'arme' ? '3' : '1';
            itemActorData.equipe = false;
            itemActorData.description = 'OBJET';
            let itemDisplay = itemActorData.categorie === 'bouclier' ? 
                game.i18n.localize('FORMULAIRE.personnage.libelle.equiper') : 
                game.i18n.localize('FORMULAIRE.personnage.libelle.nouveax');
            displayName = itemDisplay + ' ' + game.i18n.localize('TYPES.Item.' + itemActorData.categorie);
        } else {
            return null;
        }

        const createData = {'name': displayName, 'img': imagePath, 'type': itemActorData.type, 'system': itemActorData};
        delete createData['system']['type'];
        
        return this.actor.createEmbeddedDocuments('Item', [createData]).then(itemsCreated => {
            itemsCreated[0].update({'sript': MacroScript.code});
        });
    }

    /**
     * Handle item summary toggle
     */
    _onItemSummary(event) {
        event.preventDefault();
        const itemContainer = $(event.currentTarget).parents('.items-box');
        const itemActor = this.actor.items.get(itemContainer.attr('item-id'));
        
        if (itemActor.system.description !== undefined && itemActor.system.description !== null) {
            if (itemContainer.hasClass('expanded')) {
                const summaryChildren = itemContainer.children('.item-summary');
                summaryChildren.slideUp(200, () => summaryChildren.slideDown());
            } else {
                const summaryHTML = $('<div class=\'information\'><span class= \'info-label\'' + itemActor.system.description + '</blockquote></div>');
                itemContainer.append(summaryHTML.hide());
                summaryHTML.slideDown(200);
            }
            itemContainer.toggleClass('expanded');
        }
        
        const currentContext = this;
        setTimeout(function() {
            currentContext.render();
        }, 180, currentContext);
    }

    /**
     * Handle header summary toggle
     */
    _onHeaderSummary(event) {
        event.preventDefault();
        const headerContainer = $(event.currentTarget);
        const headerElement = headerContainer.parents('.items-header').children('.items-list');
        const headerClassName = headerElement[0].getElementsByClassName('item-summary');
        
        if (headerElement.hasClass('expanded')) {
            $(headerClassName).slideUp(200, function() {
                headerContainer[0].textContent = headerContainer[0].textContent.replace('-', '+');
            });
        } else {
            $(headerClassName).slideDown(200, function() {
                headerContainer[0].textContent = headerContainer[0].textContent.replace('+', '-');
            });
        }
        headerElement.toggleClass('expanded');
        
        const currentContext = this;
        setTimeout(function() {
            currentContext.render();
        }, 180, currentContext);
    }

    /**
     * Handle editor header summary toggle
     */
    _onEditorHeaderSummary(event) {
        event.preventDefault();
        const editorContainer = $(event.currentTarget);
        const headerElement = editorContainer.children('.editor-box');
        const editorClassName = headerElement[0].getElementsByClassName('editor-container');
        
        if (headerElement.hasClass('expanded')) {
            $(editorClassName).slideUp(200, function() {
                editorContainer[0].textContent = editorContainer[0].textContent.replace('-', '+');
            });
        } else {
            $(editorClassName).slideDown(200, function() {
                editorContainer[0].innerHTML = editorContainer[0].textContent.replace('+', '-');
            });
        }
        headerElement.toggleClass('expanded');
        
        const currentContext = this;
        setTimeout(function() {
            currentContext.render();
        }, 180, currentContext);
    }
}