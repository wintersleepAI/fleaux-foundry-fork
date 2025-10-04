/**
 * Handlebars Helper Functions for Fléaux RPG System
 * Deobfuscated and translated version of the original helpers.js
 * Provides custom Handlebars helpers for template rendering
 */

export const registerHandlebarsHelpers = async function() {
    
    /**
     * Check if a list is not empty
     * @param {Array} list - The list to check
     * @returns {boolean} True if list has items
     */
    Handlebars.registerHelper('listeNonVide', function(list) {
        return list.length > 0;
    });

    /**
     * Get role label with bonus information
     * @param {string} roleType - Type of role (peuple, profession, etc.)
     * @param {Object} data - Data object containing role information
     * @returns {string} Formatted role label
     */
    Handlebars.registerHelper('getRoleLibelle', function(roleType, data) {
        if (roleType === 'peuple' && data?.peuple) {
            return '[+' + data.peuple[2] + ' ' + game.i18n.localize(data.peuple[3]).toUpperCase() + '] ' + game.i18n.localize(data.peuple[1]);
        } else if (roleType === 'profession' && data?.profession) {
            return game.i18n.localize(data.profession[1]);
        } else if (roleType === 'profession' && data?.profession) {
            let result = '';
            if (data.profession[3]) {
                result = '[+' + data.profession[3] + ' ' + game.i18n.localize(data.profession[4]).toUpperCase() + '] ' + game.i18n.localize(data.profession[1]);
            }
            if (data.education && data.education[3]) {
                result = result + ', ' + game.i18n.localize(data.education[1]);
            }
            return result;
        }
    });

    /**
     * Get attribute property value
     * @param {string} attributeCode - Attribute code
     * @param {string} property - Property name
     * @returns {*} Property value or null
     */
    Handlebars.registerHelper('getAttributProperty', function(attributeCode, property) {
        let result = null;
        if (attributeCode && property) {
            let attributeData = foundry.utils.flattenObject(FLEAUX.attributes?.find(attr => attr.system.code === attributeCode), 1);
            Object.entries(attributeData).forEach(([key, value]) => {
                if (key === property) {
                    result = value;
                }
            });
        }
        return result;
    });

    /**
     * Get CSS style for dice display
     * @param {string} diceValue - Dice value (e.g., 'd6', 'd20')
     * @param {boolean} isSmall - Whether to use small size
     * @returns {string} CSS style string
     */
    Handlebars.registerHelper('getStyleForDice', function(diceValue, isSmall = false) {
        if (diceValue === null || diceValue === undefined) return;
        
        const size = isSmall ? 30 : 45;
        
        if (diceValue === '0') {
            return 'style="background-image:url(\'icons/svg/d20.svg\'); height: ' + size + 'px;"';
        } else {
            diceValue = diceValue.toString().charAt(0) !== 'd' ? 'd' + diceValue : diceValue;
            return 'style="background-image:url(\'icons/svg/' + 
                   (diceValue === 'd20' ? '' : '') + 
                   'd20.svg\'); height: ' + diceValue + '-' + 
                   (diceValue === 'd20' ? 'black' : 'grey') + 
                   '); height: ' + size + 'px;"';
        }
    });

    /**
     * Check if boolean value is not null
     * @param {*} value - Value to check
     * @returns {boolean} True if not null
     */
    Handlebars.registerHelper('booleenNonNul', function(value) {
        return value !== null;
    });

    /**
     * Check if string is not null or empty
     * @param {string} value - String to check
     * @returns {boolean} True if not null or empty
     */
    Handlebars.registerHelper('chaineNonNulOuVide', function(value) {
        return value !== null && value !== '';
    });

    /**
     * Check if number is positive
     * @param {number} value - Number to check
     * @returns {boolean} True if positive
     */
    Handlebars.registerHelper('estPositive', function(value) {
        return Number(value) > 0;
    });

    /**
     * Get actor template path
     * @param {string} templateName - Template name
     * @returns {string} Full template path
     */
    Handlebars.registerHelper('actorPartial', function(templateName) {
        return game.fleaux.templatesActorsPath + 'parts/' + templateName + '.hbs';
    });

    /**
     * Get chat template path
     * @param {string} templateName - Template name
     * @returns {string} Full template path
     */
    Handlebars.registerHelper('tchatPartial', function(templateName) {
        return game.fleaux.templatesTchatsChemin + templateName + '.hbs';
    });

    /**
     * Get item template path
     * @param {string} templateName - Template name
     * @returns {string} Full template path
     */
    Handlebars.registerHelper('itemPartial', function(templateName) {
        return game.fleaux.templatesItemsPath + 'parts/' + templateName + '.hbs';
    });

    /**
     * Get actor items template path
     * @param {string} itemType - Item type
     * @returns {string} Full template path
     */
    Handlebars.registerHelper('itemsActorPartial', function(itemType) {
        return game.fleaux.templatesActorsPath + 'parts/actor-items-' + itemType.toLowerCase() + '.hbs';
    });

    /**
     * Get attack type label
     * @param {string} attackType - Attack type code
     * @returns {string} Localized attack type label
     */
    Handlebars.registerHelper('getLibelleTypeAttaque', function(attackType) {
        if (attackType === FLEAUX.attackType.melee) {
            return game.i18n.localize('FORMULAIRE.equipement.combotypeattaque.melee');
        } else if (attackType === FLEAUX.attackType.ranged) {
            return game.i18n.localize('FORMULAIRE.equipement.combotypeattaque.tir');
        } else {
            return game.i18n.localize('FORMULAIRE.equipement.combotypeattaque.meleetir');
        }
    });

    /**
     * Get state duration type label
     * @param {string} durationType - Duration type code
     * @returns {string} Localized duration type label
     */
    Handlebars.registerHelper('getLibelleTypeDureeEtat', function(durationType) {
        switch (durationType) {
            case FLEAUX.stateDurationType.permanent:
                return game.i18n.localize('FORMULAIRE.etat.combotypeetat.permanent');
            case FLEAUX.stateDurationType.perSession:
                return game.i18n.localize('FORMULAIRE.etat.combotypeetat.parpartie');
            case FLEAUX.stateDurationType.perDay:
                return game.i18n.localize('FORMULAIRE.etat.combotypeetat.parjournee');
            case FLEAUX.stateDurationType.perScene:
                return game.i18n.localize('FORMULAIRE.etat.combotypeetat.parscene');
            case FLEAUX.stateDurationType.perCombat:
                return game.i18n.localize('FORMULAIRE.etat.combotypeetat.parcombat');
            case FLEAUX.stateDurationType.perTurn:
                return game.i18n.localize('FORMULAIRE.etat.combotypeetat.partour');
        }
    });

    /**
     * Check if current user is GM
     * @returns {boolean} True if current user is GM
     */
    Handlebars.registerHelper('getIsGM', function() {
        return game.users.current.isGM;
    });

    /**
     * Get current user ID or fallback
     * @param {string} fallback - Fallback value
     * @returns {string} Current user ID or fallback
     */
    Handlebars.registerHelper('getCurrentUserId', function(fallback) {
        return game.users.current.isGM || fallback;
    });

    /**
     * Get current actor ID or fallback
     * @param {string} fallback - Fallback value
     * @returns {string} Current actor ID or fallback
     */
    Handlebars.registerHelper('getCurrentActorId', function(fallback) {
        return game.users.current.isGM || fallback;
    });

    /**
     * Check if state is modifiable
     * @param {Object} state - State object
     * @returns {boolean} True if state is modifiable
     */
    Handlebars.registerHelper('etatEstModifiable', function(state) {
        return !(state.categorie === 'armure' && state.emplacement === '3' && state.typeAttaque === 'eTir');
    });

    /**
     * Check if state is deletable
     * @param {Object} state - State object
     * @returns {boolean} True if state can be deleted
     */
    Handlebars.registerHelper('etatEstsupprimable', function(state) {
        return !(state.categorie === 'armure' && state.emplacement === '3' && state.typeAttaque === 'eTir');
    });
};