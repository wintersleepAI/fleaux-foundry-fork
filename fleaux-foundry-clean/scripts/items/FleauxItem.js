/**
 * FleauxItem - Core Item class for Fleaux system
 * Deobfuscated and translated version of scripts/items/FleauxItem.js
 */

import MacroScript from '../../libs/core-foundry/modules/components/MacroScript.mjs';

export class FleauxItem extends Item {
    
    /**
     * Check if item is broken (wear-die is zero)
     */
    get isBroken() {
        return this.system['wear-die'].current === '0';
    }

    /**
     * Check if item can be equipped
     */
    get canBeEquipped() {
        return !(this.system.category === 'armor' && 
                this.system.slot === '3' && 
                this.system.equipped === true);
    }

    /**
     * Static method to create item documents
     */
    static async createDocuments(itemData, options = { activate: false, script: null }) {
        // Set default image if not specified
        if (itemData.img === undefined) {
            itemData.img = game.fleaux.imagesPath + 
                         'system/' + 
                         game.fleaux.itemType[itemData.type] + 
                         '/_' + 
                         game.i18n.itemType[itemData.type] + 
                         '.webp';
        }

        const item = await super.create(itemData, options);
        
        // Initialize equipment items
        item.then(createdItem => {
            if (createdItem.type === game.fleaux.itemType.equipment && 
                createdItem.system.category === undefined) {
                createdItem.system.category = 'object';
            }
            createdItem.initialize({
                activate: options.activate,
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
            console.error(game.i18n.localize('ERROR.object.initialize') + ' ' + 
                         this.constructor.name + ' ' + this.id + ':');
            console.error(error);
        }
    }

    /**
     * Execute usage dice roll
     */
    async rollUsageDice(title, diceType) {
        let diceValue = null;

        if (diceType === FLEAUX.usageDieEnum.equipment) {
            diceValue = this.system.wearDie?.current;
        } else {
            if (diceType === FLEAUX.usageDieEnum.spell) {
                diceValue = this.system?.enchantment?.object?.spell?.wearDie?.current;
            }
        }

        let currentDice = parseInt(diceValue?.replace('d', ''));

        if (diceValue === null || diceValue === '0') {
            ui.notifications.error(game.i18n.localize('NOTIFICATION.isEquipable.alreadyExhausted.warning'));
        } else {
            let dice = new game.fleaux.dice(diceValue, this.actor);
            await dice.display(title, {
                rollType: FLEAUX.rollTypeEnum.usage
            });

            if (dice && dice._evaluated) {
                if (dice?.total <= 2) {
                    currentDice = currentDice - (currentDice === 14 ? 8 : 2);
                }
                if (currentDice === 2) {
                    currentDice = null;
                }

                if (diceType === FLEAUX.usageDieEnum.equipment) {
                    this.update({
                        'system.wear-die.current': currentDice === null ? '0' : 'd' + currentDice
                    }).then(updatedItem => {
                        if (currentDice === null) {
                            updatedItem.break();
                        }
                    });
                } else {
                    if (diceType === FLEAUX.usageDieEnum.spell) {
                        this.update({
                            'system.enchantment.object.spell.wear-die.current': currentDice === null ? '0' : 'd' + currentDice
                        });
                    }
                }
            }
        }
    }

    /**
     * Verify usage dice roll
     */
    verifyUsageDice(diceResult, diceType) {
        let expectedValue = null;

        if (diceType === FLEAUX.usageDieEnum.equipment) {
            expectedValue = this.system.wearDie?.max;
        } else {
            if (diceType === FLEAUX.usageDieEnum.spell) {
                expectedValue = this.system?.enchantment?.object?.spell?.wearDie?.max;
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
    equip(forceEquip = null) {
        let errorMessage = null;
        const currentlyEquipped = this.system.equipped;

        if (this.isBroken) {
            errorMessage = game.i18n.localize('NOTIFICATION.isEquipable.isBroken.error');
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
            this.type === game.fleaux.typeItem.equipment || 
            this.type === game.fleaux.typeItem.spell || 
            this.type === game.fleaux.typeItem.state) {
            
            if (this.type === game.fleaux.typeItem.equipment) {
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
        if ((this.type === game.fleaux.typeItem.equipment || 
             this.type === game.fleaux.typeItem.spell || 
             this.type === game.fleaux.typeItem.talent || 
             this.type === game.fleaux.typeItem.state)) {
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
        if (this.type === game.fleaux.typeItem.equipment || 
            this.type === game.fleaux.typeItem.spell || 
            this.type === game.fleaux.typeItem.talent || 
            this.type === game.fleaux.typeItem.state) {
            
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
