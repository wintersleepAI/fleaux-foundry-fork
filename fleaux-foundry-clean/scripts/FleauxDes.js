/**
 * FleauxDes - Custom Dice Rolling System for Fléaux RPG
 * Deobfuscated and translated version of the original FleauxDes.js
 * Extends Foundry VTT's Roll class with custom Fleaux-specific functionality
 */

export class FleauxDes extends Roll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);
        
        // Set template path for chat messages
        this.template = game.fleaux.templatesTchatsChemin + 'lancer-des-dialogue.html' || this.constructor.TCHAT_TEMPLATE;
        
        // Initialize Fleaux-specific roll data
        this.fleaux = {
            titreTchat: '',           // Chat title
            succes: false,            // Success status
            critique: false,          // Critical status
            ressourcePerdue: false,   // Resource lost status
            seDepasser: false,        // Push beyond limit status
            bonusMalus: 0,            // Bonus/malus value
            difficulte: null,         // Difficulty value
            pionCible: null,          // Target token
            libelleDefoncer: options?.libelleDefoncer,
            libelleSuccesCritique: options?.libelleSuccesCritique
        };
    }

    /**
     * Evaluate the dice roll with custom Fleaux logic
     * @param {Object} options - Evaluation options
     * @param {boolean} options.minimize - Minimize dice results
     * @param {boolean} options.maximize - Maximize dice results
     * @returns {Promise<FleauxDes>} The evaluated roll
     */
    async evaluate({minimize = false, maximize = false} = {}) {
        // Check if already evaluated
        if (this._evaluated) {
            throw new Error(game.i18n.localize('ERREUR.FleauxDes.dejalance'));
        }
        
        // Check if formula has dice
        if (this.terms.length < 1) {
            throw new Error(game.i18n.localize('ERREUR.FleauxDes.aucundes'));
        }

        // Determine dice modifier based on roll type and advantage/disadvantage
        let diceModifier = '';
        if (this.fleaux.typeLancerDes === FLEAUX.rollTypeEnum.attributes || this.fleaux.typeLancerDes === undefined) {
            diceModifier = '';
        } else {
            diceModifier = 'k' + (
                this.fleaux.typeLancerDes === FLEAUX.rollTypeEnum.attributes
                    ? (this.fleaux.typeDes === FLEAUX.diceType.disadvantage ? 'l' : 'h')
                    : (this.fleaux.typeDes === FLEAUX.diceType.disadvantage ? 'h' : 'l')
            );
        }

        // Modify formula based on roll type
        if (this.fleaux.typeLancerDes === FLEAUX.rollTypeEnum.attributes) {
            let formulaParts = this._formula.split('d');
            this._formula = formulaParts[0] + diceModifier + (formulaParts[1] ? 'd' + formulaParts[1] : '') + (formulaParts[2] ? 'd' + formulaParts[2] : '');
        } else {
            this._formula = this._formula + diceModifier;
        }

        // Apply dice type modifier to formula
        if (this.fleaux.typeDes !== undefined) {
            this._formula = this._formula.replace(this._formula.charAt(), Math.abs(this.fleaux.typeDes) + 1);
        }

        // Set difficulty from target token
        this.fleaux.difficulte = this.fleaux.pionCible?.actor?.system?.attributs;

        // Handle push beyond limit (seDepasser)
        if (this.fleaux.seDepasser) {
            if (this.fleaux.typeLancerDes === FLEAUX.rollTypeEnum.attributes) {
                this._formula = this._formula + ' + ' + this.data?.system?.attributs[FLEAUX.rollTypeEnum.attributes]?.actuel;
            } else {
                if (this.fleaux.typeLancerDes === FLEAUX.rollTypeEnum.damage) {
                    this._formula = this._formula + ' + ' + this.data?.system?.attributs[FLEAUX.rollTypeEnum.attributes]?.actuel;
                }
            }
        }

        // Calculate bonus/malus for attribute rolls
        if (this.fleaux.typeLancerDes === FLEAUX.rollTypeEnum.attributes && this.fleaux.pionCible) {
            this.fleaux.bonusMalus = this.fleaux.pionCible?.bonusMalus?.value || 0;
            this.fleaux.difficulte = parseInt(this.fleaux.difficulte) + parseInt(this.fleaux.bonusMalus);
        }

        // Parse the formula
        this.terms = this._parseFormula(this._formula, this.data);

        try {
            return await super.evaluate({minimize: minimize, maximize: maximize}).then(async (roll) => {
                // Determine success/failure
                roll.fleaux.succes = roll.total < parseInt(this.fleaux.difficulte) + parseInt(this.fleaux.bonusMalus);
                roll.fleaux.typeLancerDes = this.fleaux.typeLancerDes;

                // Handle different roll types
                if (roll.fleaux.typeLancerDes === FLEAUX.rollTypeEnum.attributes && this.fleaux.difficulte) {
                    roll.fleaux.succes = roll.fleaux.succes;
                    roll.fleaux.critique = roll.total <= Number(this.data?.system?.critique?.value) || roll.total >= Number(this.data?.system?.critique?.maximum);
                } else {
                    // Handle willpower and damage rolls
                    if (roll.fleaux.typeLancerDes === FLEAUX.rollTypeEnum.willpower || roll.fleaux.typeLancerDes === FLEAUX.rollTypeEnum.willpower) {
                        roll.fleaux.ressourcePerdue = roll.total <= 2;
                        roll.fleaux.succes = !(roll.total <= 2);
                    }
                }

                // Send message to chat
                await roll.toMessage({
                    speaker: {
                        actor: roll.data?.id || null,
                        token: roll.data?.token?.id || null,
                        alias: roll.data?.name || null
                    }
                }, {
                    rollMode: roll.fleaux.pionCible?.modeJet?.value
                });
            });
        } catch (error) {
            return this;
        }
    }

    /**
     * Render the roll as a chat message
     * @param {Object} messageOptions - Message options
     * @returns {Promise<string>} Rendered HTML
     */
    async toMessage(messageOptions = {}) {
        messageOptions = foundry.utils.mergeObject({
            user: game.user.id,
            flavor: null,
            template: this.fleaux.typeLancerDes === undefined 
                ? game.fleaux.templatesTchatsChemin + 'lancer-des-dialogue.html'
                : game.fleaux.templatesTchatsChemin + ('lancer-' + this.fleaux.typeLancerDes + '.hbs'),
            blind: false
        }, messageOptions);

        const isPrivate = messageOptions.blind;
        
        if (!this._evaluated) {
            await this.roll();
        }

        let tooltip = await this.getTooltip();
        
        const messageData = {
            formula: isPrivate ? '???' : this._formula,
            flavor: isPrivate ? null : messageOptions.flavor || this.options.flavor,
            user: messageOptions.user,
            isPublicRoll: !isPrivate,
            tooltip: isPrivate ? '' : tooltip,
            total: isPrivate ? '?' : Math.round(this._total * 100) / 100,
            data: this.data,
            fleaux: isPrivate ? {label: '???'} : {...this.fleaux}
        };

        return renderTemplate(messageOptions.template, messageData);
    }

    /**
     * Create FleauxDes from data
     * @param {Object} data - Roll data
     * @returns {FleauxDes} New FleauxDes instance
     */
    static fromData(data) {
        const roll = super.fromData(data);
        roll.data = data.data;
        roll.fleaux = data.fleaux;
        return roll;
    }

    /**
     * Convert to JSON
     * @returns {Object} JSON representation
     */
    toJSON() {
        const json = super.toJSON();
        json.data = foundry.utils.duplicate(this.data);
        json.fleaux = foundry.utils.duplicate(this.fleaux);
        return json;
    }

    /**
     * Display roll dialog
     * @param {string} title - Dialog title
     * @param {Object} options - Dialog options
     * @returns {Promise<FleauxDes|null>} Roll result or null if cancelled
     */
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
                        this.fleaux.typeDes = FLEAUX.diceType.disadvantage;
                        this.fleaux.form = html[0].querySelector('form');
                        resolve(this.evaluate());
                    }
                },
                normalBtn: {
                    label: game.i18n.localize('DIALOGUE.des.normal'),
                    callback: (html) => {
                        this.fleaux.typeDes = FLEAUX.diceType.normal;
                        this.fleaux.form = html[0].querySelector('form');
                        resolve(this.evaluate());
                    }
                },
                avantageBtn: {
                    label: game.i18n.localize('DIALOGUE.des.avantage'),
                    callback: (html) => {
                        this.fleaux.typeDes = FLEAUX.diceType.advantage;
                        this.fleaux.form = html[0].querySelector('form');
                        resolve(this.evaluate());
                    }
                }
            };

            let defaultButton = 'normalBtn';

            // Modify buttons based on roll type and conditions
            if ((this.fleaux.typeLancerDes === FLEAUX.rollTypeEnum.attributes && this.data?.system?.attributs?.handicape) ||
                (options.cleAttribut === 'handicape' && this.data?.system?.attributs?.handicape) ||
                this.data?.system?.attributs?.blesse ||
                (options.seDepasser && this.data?.system?.sorcellerie?.dernierSortLance)) {
                buttons = {desavantageBtn: buttons.desavantageBtn};
                defaultButton = 'desavantageBtn';
            }

            if ((options.typeLancerDes === FLEAUX.rollTypeEnum.damage && !this.data?.system?.armeEquipee2Mains && this.data?.system?.parade) ||
                (options.typeLancerDes === FLEAUX.rollTypeEnum.attributes && options.seDepasser && this.data?.system?.bouclier)) {
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
