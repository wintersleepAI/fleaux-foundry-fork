/**
 * FleauxItem - Core Item class for Fleaux system
 * Deobfuscated version of scripts/items/FleauxItem.js
 */

import MacroScript from '../../libs/core-foundry/modules/components/MacroScript.mjs';

export class FleauxItem extends Item {
    
    /**
     * Check if item is broken (de-usure is zero)
     */
    get cassé() {
        return this.system['de-usure'].actuel === '0';
    }

    /**
     * Check if item can be equipped
     */
    get peutEtreEquipable() {
        return !(this.system.categorie === 'armure' && 
                this.system.emplacement === '3' && 
                this.system.equipe === true);
    }

    /**
     * Static method to create item documents
     */
    static async createDocuments(itemData, options = { activer: false, script: null }) {
        // Set default image if not specified
        if (itemData.img === undefined) {
            itemData.img = game.fleaux.imagesPath + 
                         'system/' + 
                         game.fleaux.typeItem[itemData.type] + 
                         '/_' + 
                         game.i18n.typeItem[itemData.type] + 
                         '.webp';
        }

        const item = await super.create(itemData, options);
        
        // Initialize equipment items
        item.then(createdItem => {
            if (createdItem.type === game.fleaux.typeItem.equipement && 
                createdItem.system.categorie === undefined) {
                createdItem.system.categorie = 'objet';
            }
            createdItem.initialize({
                activer: options.activer,
                script: options.script
            });
        });
        
        return item;
    }

    /**
     * Initialize item when created
     */
    initialize() {
        try {
            console.log('FleauxItem.initialize');
        } catch (error) {
            console.error(game.i18n.localize('ERREUR.objet.initialise') + ' ' + 
                         this.constructor.name + ' ' + this.id + ' :');
            console.error(error);
        }
    }

    /**
     * Execute usage dice roll
     */
    async lancerDesUsage(title, diceType) {
        let diceValue = null;

        if (diceType === FLEAUX.deUsageEnum.eEquipement) {
            diceValue = this.system.deUsure?.actuel;
        } else {
            if (diceType === FLEAUX.deUsageEnum.eSort) {
                diceValue = this.system?.enchantement?.objet?.sort?.deUsure?.actuel;
            }
        }

        let currentDice = parseInt(diceValue?.replace('d', ''));

        if (diceValue === null || diceValue === '0') {
            ui.notifications.error(game.i18n.localize('NOTIFICATION.estEquipable.dejaepuise.avertissement'));
        } else {
            let dice = new game.fleaux.des(diceValue, this.actor);
            await dice.afficher(title, {
                typeLancerDes: FLEAUX.typeLancerDesEnum.eUsage
            });

            if (dice && dice._evaluated) {
                if (dice?.total <= 2) {
                    currentDice = currentDice - (currentDice === 14 ? 8 : 2);
                }
                if (currentDice === 2) {
                    currentDice = null;
                }

                if (diceType === FLEAUX.deUsageEnum.eEquipement) {
                    this.update({
                        'system.de-usure.actuel': currentDice === null ? '0' : 'd' + currentDice
                    }).then(updatedItem => {
                        if (currentDice === null) {
                            updatedItem.casse();
                        }
                    });
                } else {
                    if (diceType === FLEAUX.deUsageEnum.eSort) {
                        this.update({
                            'system.enchantement.objet.sort.de-usure.actuel': currentDice === null ? '0' : 'd' + currentDice
                        });
                    }
                }
            }
        }
    }

    /**
     * Verify usage dice roll
     */
    verifierDesUsage(diceResult, diceType) {
        let expectedValue = null;

        if (diceType === FLEAUX.deUsageEnum.eEquipement) {
            expectedValue = this.system.deUsure?.max;
        } else {
            if (diceType === FLEAUX.deUsageEnum.eSort) {
                expectedValue = this.system?.enchantement?.objet?.sort?.deUsure?.max;
            }
        }

        if (diceResult === null || diceResult === '0') {
            return false;
        }

        return parseInt(diceResult?.replace('d', '')) <= parseInt(expectedValue?.replace('d', ''));
    }

    /**
     * Toggle equipment state
     */
    équiper(forceEquip = null) {
        let errorMessage = null;
        const currentlyEquipped = this.system.equipe;

        if (this.cassé) {
            errorMessage = game.i18n.localize('NOTIFICATION.estEquipable.estcasse.erreur');
        } else {
            if (this?.actor?.mainsEncombrees && this?.actor?.mainsEncombrees(this.system)) {
                errorMessage = !this?.system?.equipe ? 
                               game.i18n.localize('NOTIFICATION.estEquipable.mainindisponible.erreur') : null;
            } else {
                if (this?.system?.categorie === 'armure' && this?.actor?.armureEquipee) {
                    errorMessage = !this?.system?.equipe ? 
                                   game.i18n.localize('NOTIFICATION.estEquipable.dejaequipe.erreur') : null;
                }
            }
        }

        this.system.equipe = errorMessage ? false : !this.system?.equipe;
        
        if (errorMessage === null) {
            this.activer(this.system.equipe);
        } else {
            if (currentlyEquipped) {
                this.activer(false);
            }
        }

        this.system.macroScript.active = this.system.equipe;
        
        return this.update({ 'system': this.system }).then(() => {
            this.executer();
            
            if (errorMessage) {
                ui.notifications.warn(errorMessage);
            } else {
                if (!this.cassé && this.peutEtreEquipable) {
                    foundry.AudioHelper.AudioHelper.play({
                        src: '/systems/fleaux/sounds/sword.mp3',
                        volume: 0.8,
                        autoplay: true,
                        loop: false
                    }, false);
                }
            }
            
            if (this.cassé) {
                foundry.AudioHelper.AudioHelper.play({
                    src: '/systems/fleaux/sounds/casse.mp3',
                    volume: 0.8,
                    autoplay: true,
                    loop: false
                }, false);
            }
        });
    }

    /**
     * Delete item (with cleanup)
     */
    async delete(options) {
        this.supprimerMacroScript();
        return await super.delete(options);
    }

    /**
     * Activate/deactivate item macro
     */
    activer(options = { activer: false, modifiable: true, supprimable: true, script: null }) {
        // Create macro scripts for specific item types
        if (this.type === game.fleaux.typeItem.talent || 
            this.type === game.fleaux.typeItem.equipement || 
            this.type === game.fleaux.typeItem.sort || 
            this.type === game.fleaux.typeItem.etat) {
            
            if (this.type === game.fleaux.typeItem.equipement) {
                let currentDate = new Date(Date.now());
                this.system.date = currentDate.toLocaleDateString() + ' ' + currentDate.toLocaleTimeString();
            }
            
            new MacroScript(this, options.activer, options.modifiable, options.supprimable)
                .creer(options.script);
        }
    }

    /**
     * Remove macro script
     */
    supprimerMacroScript() {
        if ((this.type === game.fleaux.typeItem.equipement || 
             this.type === game.fleaux.typeItem.sort || 
             this.type === game.fleaux.typeItem.talent || 
             this.type === game.fleaux.typeItem.etat)) {
            new MacroScript(this, false).supprimer();
        }
    }

    /**
     * Show macro script execution
     */
    async afficherMacroScript() {
        let macroScript = this.system.macroScript;
        
        if (macroScript) {
            if (macroScript.idMacro === null) {
                await new MacroScript(this).creer();
            }
            new MacroScript(this).executer();
        }
    }

    /**
     * Activate/deactivate macro
     */
    executer(active = null) {
        if (this.type === game.fleaux.typeItem.equipement || 
            this.type === game.fleaux.typeItem.sort || 
            this.type === game.fleaux.typeItem.talent || 
            this.type === game.fleaux.typeItem.etat) {
            
            const macroScript = this.system.macroScript;
            
            if (macroScript) {
                new MacroScript(this, 
                              active === null ? !macroScript.active : active, 
                              macroScript.parent.modifiable, 
                              macroScript.parent.supprimable).activer();
            }
        }
    }
}
