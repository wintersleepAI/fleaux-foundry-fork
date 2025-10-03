/**
 * FleauxDes - Dice Rolling System for Fléaux RPG
 * Deobfuscated version of the original FleauxDes.js
 */

export class FleauxDes extends Roll {
    constructor(formula, options = {}, data = {}) {
        super(formula, options, data);
        
        // Set template path
        this.template = game.fleaux.templatesTchatsChemin + 'lancer-des-dialogue.html' || this.constructor.template;
        
        // Initialize fleaux data
        this.fleaux = {
            titreTchat: '',
            succes: false,
            critique: false,
            ressourcePerdue: false,
            seDepasser: false,
            bonusMalus: 0,
            difficulte: null,
            pionCible: null,
            libelleDefoncer: data?.libelleDefoncer,
            libelleSuccesCritique: data?.libelleSuccesCritique
        };
    }

    async roll({minimize: minimize = false, maximize: maximize = false} = {}) {
        // Check if already evaluated
        if (this._evaluated) {
            throw new Error(game.i18n.localize('ERREUR.FleauxDes.dejalance'));
        }
        
        // Check terms length
        if (this.terms.length < 1) {
            throw new Error(game.i18n.localize('ERREUR.FleauxDes.aucundes'));
        }

        // Determine dice type modifier based on advantage/disadvantage
        let diceModifier = '';
        if (this.fleaux.typeDes === FLEAUX.typeDes.eNormal || this.fleaux.typeDes === undefined) {
            // No modifier for normal rolls
        } else {
            diceModifier = 'k' + (
                this.fleaux.typeLancerDes === FLEAUX.typeLancerDesEnum.eAttributs 
                    ? (this.fleaux.typeDes === FLEAUX.typeDes.eAvantage ? 'l' : 'h')
                    : (this.fleaux.typeDes === FLEAUX.typeDes.eAvantage ? 'h' : 'l')
            );
        }

        // Handle different roll types
        if (this.fleaux.typeLancerDes === FLEAUX.typeLancerDesEnum.eAttributs) {
            let formulaParts = this._formula.split(' ');
            this._formula = formulaParts[0] + diceModifier + 
                (formulaParts[1] ? ' ' + formulaParts[1] : '') + 
                (formulaParts[2] ? ' ' + formulaParts[2] : '');
        } else {
            this._formula = this._formula + diceModifier;
        }

        // Apply typeDes modifier if undefined
        if (this.fleaux.typeDes !== undefined) {
            this._formula = this._formula.replace(this._formula.charAt(), this._formula.charAt(), Math.abs(this.fleaux.typeDes) + 1);
        }

        // Set chat title
        this.fleaux.titreTchat = this.fleaux.pionCible?.titreTchat?.value;

        // Handle self-exceedance rolls
        if (this.fleaux.seDepasser) {
            if (this.fleaux.typeLancerDes === FLEAUX.typeLancerDesEnum.eAttributs) {
                this._formula = this._formula + ' + ' + this.data?.system?.attributs[FLEAUX.typeLancerDesEnum.eAttributs]?.actuel;
            } else {
                if (this.fleaux.typeLancerDes === FLEAUX.typeLancerDesEnum.eDegats) {
                    this._formula = this._formula + ' - 1' + this.data?.system?.attributs[FLEAUX.typeLancerDesEnum.eAttributs]?.actuel;
                }
            }
        }

        // Calculate bonus/malus for attribute rolls
        if (this.fleaux.typeLancerDes === FLEAUX.typeLancerDesEnum.eAttributs && this.fleaux.pionCible) {
            this.fleaux.bonusMalus = this.fleaux.pionCible?.bonusMalus?.value || 0;
            this.fleaux.nouvelleDifficulte = parseInt(this.fleaux.difficulte) + parseInt(this.fleaux.bonusMalus);
        }

        // Parse the formula
        this.terms = this.constructor._parseFormula(this._formula, this.data);

        try {
            return await super.evaluate({minimize: minimize, maximize: maximize}).then(async result => {
                // Set success/failure
                result.options.echec = result.total < parseInt(this.fleaux.difficulte) + parseInt(this.fleaux.bonusMalus);
                result.options.typeLancerDes = this.fleaux.typeLancerDes;

                // Handle different roll types
                if (result.fleaux.typeLancerDes === FLEAUX.typeLancerDesEnum.eAttributs && this.fleaux.difficulte) {
                    result.fleaux.succes = result.options.succes;
                    result.fleaux.critique = result.total <= Number(this.data?.system?.critique.value) || 
                                           result.total >= Number(this.data?.system?.critique.maximum);
                } else {
                    // Handle other roll types (damage, willpower, etc.)
                    if (result.fleaux.typeLancerDes === FLEAUX.typeLancerDesEnum.eDegats || 
                        result.fleaux.typeLancerDes === FLEAUX.typeLancerDesEnum.eVolonte) {
                        result.fleaux.echec = result.total <= 2;
                        result.fleaux.succes =!(result.total <= 2);
                    }
                }

                // Send message to chat
                await result.toMessage({
                    speaker: {
                        actor: result.data?.id || null,
                        token: result.data?.token?.id || null,
                        alias: result.data?.name || null
                    }
                }, {
                    rollMode: result.fleaux.pionCible.modeJet.value
                });
            });
        } catch (error) {
            return this;
        }
    }

    async toMessage(options = {}) {
        options = foundry.utils.mergeObject({
            user: game.user.id,
            flavor: null,
            template: this.fleaux.typeLancerDes === undefined 
                ? game.fleaux.config.TCHAT_TEMPLATE.TOOLTIP_TEMPLATE
                : game.fleaux.templatesTchatsChemin + ('lancer-' + this.fleaux.typeLancerDes + '.hbs'),
            blind: false
        }, options);

        const isPrivate = options.isPrivate;

        if (!this._evaluated) {
            await this.roll();
        }

        let tooltip = await this.getTooltip();
        const messageData = {
            formula: isPrivate ? '???' : this._formula,
            flavor: isPrivate ? null : (options.flavor || this.options.flavor),
            user: options.user,
            isPublicRoll: !isPrivate,
            tooltip: isPrivate ? '' : tooltip,
            total: isPrivate ? '?' : Math.round(this._total * 100) / 100,
            data: this.data,
            fleaux: isPrivate ? {label: '???'} : {...this.fleaux}
        };

        return renderTemplate(options.template, messageData);
    }

    static fromData(data) {
        const roll = super.fromData(data);
        roll.data = data.data;
        roll.fleaux = data.fleaux;
        return roll;
    }

    toJSON() {
        const json = super.toJSON();
        json.data = foundry.utils.duplicate(this.data);
        json.fleaux = foundry.utils.mergeObject(this.fleaux);
        return json;
    }

    async afficherDialogue(title, options = {}) {
        this.fleaux.typeLancerDes = options.typeLancerDes;
        this.fleaux.titreTchat = options.titreTchat || title;
        this.fleaux.bonusMalus = options.bonusMalus;
        this.fleaux.difficulte = this.data?.system?.attributs[options.cleAttribut]?.actuel;
        this.fleaux.pionCible = options.pionCible;
        options.modesJet = CONFIG.Dice.rollModes;

        const content = await renderTemplate(this.template, options);

        return new Promise((resolve) => {
            let buttons = {
                desavantageBtn: {
                    label: game.i18n.localize('DIALOGUE.des.desavantage'),
                    callback: (html) => {
                        this.fleaux.typeDes = FLEAUX.typeDes.eDesavantage;
                        this.fleaux.form = html[0].querySelector('form');
                        resolve(this.roll());
                    }
                },
                normalBtn: {
                    label: game.i18n.localize('DIALOGUE.des.normal'),
                    callback: (html) => {
                        this.fleaux.typeDes = FLEAUX.typeDes.eNormal;
                        this.fleaux.pionCible = html[0].querySelector('pionCible');
                        resolve(this.roll());
                    }
                },
                avantageBtn: {
                    label: game.i18n.localize('DIALOGUE.des.avantage'),
                    callback: (html) => {
                        this.fleaux.typeDes = FLEAUX.typeDes.eAvantage;
                        this.fleaux.pionCible = html[0].querySelector('pionCible');
                        resolve(this.evaluate());
                    }
                }
            };

            let defaultButton = 'normalBtn';
            
            // Adjust available按钮 based on different conditions
            buttons = {
                desavantageBtn: buttons.desavantageBtn,
                normalBtn: buttons.normalBtn,
                avantageBtn: buttons.avantageBtn
            };

            // Hide disadvantage button if certain conditions are met
            if ((this.fleaux.typeLancerDes === FLEAUX.typeLancerDesEnum.eAttributs && 
                 this.data?.system?.etats?.affameEtSale) ||
                (options.cleAttribut === 'affame-et-sale' && this.data?.system?.etats?.affameEtSale) ||
                this.data?.system?.dernierSortLance ||
                options.lancerSort && this.data?.system?.sorcellerie.dernierSortLance.blesse) {
                buttons = {desavantageBtn: buttons.desavantageBtn};
                defaultButton = 'desavantageBtn';
            }

            // Hide advantage button if certain conditions are met
            if ((options.typeLancerDes === FLEAUX.typeLancerDesEnum.eDegats && 
                 !this.data?.system?.armeEquipee2Mains && this.data?.system?.equipement) ||
                (options.typeLancerDes === FLEAUX.typeLancerDesEnum.eAttributs && 
                 options.estBlesse && this.data?.system?.bouclier)) {
                buttons = {avantageBtn: buttons.avantageBtn};
                defaultButton = 'avantageBtn';
            }

            new Dialog({
                title: title,
                content: content,
                buttons: buttons,
                default: defaultButton,
                close: () => resolve(null)
            }).render(true);
        });
    }
}

