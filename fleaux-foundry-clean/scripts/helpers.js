/**
 * Handlebars Helper Functions for Fléaux RPG System
 * Deobfuscated and translated version of scripts/helpers.js
 */

/**
 * Register all Handlebars helper functions for the Fléaux RPG system
 */
export const registerHandlebarsHelpers = async function() {
    
    /**
     * Check if a list/array is not empty
     * @param {Array} list - The array to check
     * @returns {boolean} True if array has length > 0
     */
    Handlebars.registerHelper('listNotEmpty', function(list) {
        return list.length > 0;
    });

    /**
     * Format attribute/profession information for display
     * @param {string} type - The type of information to format
     * @param {Object} data - The data containing the information
     * @returns {string} Formatted display string
     */
    Handlebars.registerHelper('getAttributeProfession', function(type, data) {
        // Handle attribute bonuses/penalties
        if (type === 'attribute' && data?.bonusPenalty) {
            return '[+' + data?.bonusPenalty[2] + ' ' + 
                   game.i18n.localize(data?.bonusPenalty[3]).toUpperCase() + '] ' + 
                   game.i18n.localize(data?.bonusPenalty[1]);
        } else {
            // Handle profession information
            if (type === 'profession' && data?.profession[0]) {
                return game.i18n.localize(data?.profession[0][1]);
            } else {
                // Handle multiple professions
                if (type === 'profession' && data?.profession) {
                    let result = '';
                    
                    // Primary profession
                    if (data?.profession[3]) {
                        result = '[+' + data?.profession[3] + ' ' + 
                                game.i18n.localize(data?.profession[4]).toUpperCase() + '] ' + 
                               game.i18n.localize(data?.profession[1]);
                    }
                    
                    // Secondary profession
                    if (data?.length && data?.length[3]) {
                        result = result + ', ' + game.i18n.localize(data?.length[1]);
                    }
                    
                    return result;
                }
            }
        }
    });

    /**
     * Get a specific attribute property from the attributes list
     * @param {string} attributeCode - The attribute code to find
     * @param {string} property - The property to retrieve
     * @returns {*} The requested property value
     */
    Handlebars.registerHelper('getAttributProperty', function(attributeCode, property) {
        let result = null;
        
        if (attributeCode && property) {
            // Find the attribute in the global attributes list
            let attributeData = foundry.utils.flattenObject(
                FLEAUX.attributs?.find(attr => attr.system.code === attributeCode), 
                1
            );
            
            // Extract the specific property
            Object.entries(attributeData).forEach(([key, value]) => {
                if (key === property) {
                    result = value;
                }
            });
        }
        
        return result;
    });

    /**
     * Generate CSS styling for dice based on type
     * @param {string} diceType - The type of dice (null, '0', or dice string)
     * @param {boolean} isSmall - Whether to generate small style version
     * @returns {string} CSS styling string
     */
    Handlebars.registerHelper('getStyleForDice', function(diceType, isSmall = false) {
        if (diceType === null || diceType === undefined) {
            return; // Return nothing for null/undefined
        }

        const pixelSize = isSmall ? 30 : 45;
        
        if (diceType === '0') {
            return 'style="background-image:url(\'icons/svg/d20\'); height: ' + 
                   pixelSize + 'px;" color:white;';
        } else {
            // Format dice type if not already formatted
            diceType = diceType.toString().charAt(0) !== 'd' ? 'd' + diceType : diceType;
            
            return 'style="background-image:url(\'icons/svg/' + 
                   (diceType === 'd20' ? '' : diceType) + '.svg\'); height: ' + 
                   pixelSize + 'px;' + diceType + '-' + 
                   (diceType === 'd20' ? 'black' : 'grey') + 
                   'px;"' + pixelSize + 'px;"';
        }
    });

    /**
     * Check if a boolean value is not null
     * @param {*} value - Value to check
     * @returns {boolean} True if value is not null
     */
    Handlebars.registerHelper('booleenNonNul', function(value) {
        return value !== null;
    });

    /**
     * Check if a string is not null and not empty
     * @param {string} string - String to check
     * @returns {boolean} True if string is not null and not empty
     */
    Handlebars.registerHelper('chaineNonNulOuVide', function(string) {
        return string !== null && string !== '';
    });

    /**
     * Check if a number is greater than 0
     * @param {number} number - Number to check
     * @returns {boolean} True if number > 0
     */
    Handlebars.registerHelper('estPositive', function(number) {
        return Number(number) > 0;
    });

    /**
     * Get template path for actor partials
     * @param {string} actorType - The type of actor
     * @returns {string} Path to the actor template
     */
    Handlebars.registerHelper('actorPartial', function(actorType) {
        return game.fleaux.templatesPath + 'parts/' + actorType + '.hbs';
    });

    /**
     * Get template path for item partials
     * @param {string} itemType - The type of item
     * @returns {string} Path to the item template
     */
    Handlebars.registerHelper('itemPartial', function(itemType) {
        return game.fleaux.templatesPath + 'parts/' + itemType + '.hbs';
    });

    /**
     * Get template path for chat partials
     * @param {string} tchatType - The type of chat component
     * @returns {string} Path to the chat template
     */
    Handlebars.registerHelper('tchatPartial', function(tchatType) {
        return game.fleaux.templatesPath + tchatType + '.hbs';
    });

    /**
     * Get template path for actor item partials
     * @param {string} itemType - The type of item
     * @returns {string} Path to the actor items template
     */
    Handlebars.registerHelper('itemsActorPartial', function(itemType) {
        return game.fleaux.templatesActorsPath + 'parts/actor-items-' + 
               itemType.toLowerCase() + '.hbs';
    });

    /**
     * Get localized attack type label
     * @param {string} attackType - The attack type
     * @returns {string} Localized attack type label
     */
    Handlebars.registerHelper('getLibelleTypeAttaque', function(attackType) {
        return attackType === FLEAUX.typeAttaque.eMelee 
            ? game.i18n.localize('FORMULAIRE.equipement.combotypeattaque.melee')
            : attackType === FLEAUX.typeAttaque.eTir 
                ? game.i18n.localize('FORMULAIRE.equipement.combotypeattaque.tir')
                : game.i18n.localize('FORMULAIRE.equipement.combotypeattaque.meleetir');
    });

    /**
     * Get localized duration type label
     * @param {string} durationType - The duration type
     * @returns {string} Localized duration type label
     */
    Handlebars.registerHelper('getLibelleTypeDureeEtat', function(durationType) {
        switch (durationType) {
            case FLEAUX.typeDureeEtat.ePermanent:
                return game.i18n.localize('FORMULAIRE.etat.combotypeetat.permanent');
            case FLEAUX.typeDureeEtat.eParPartie:
                return game.i18n.localize('FORMULAIRE.etat.combotypeetat.parpartie');
            case FLEAUX.typeDureeEtat.eParJournee:
                return game.i18n.localize('FORMULAIRE.etat.combotypeetat.parjournee');
            case FLEAUX.typeDureeEtat.eParScene:
                return game.i18n.localize('FORMULAIRE.etat.combotypeetat.parscene');
            case FLEAUX.typeDureeEtat.eParCombat:
                return game.i18n.localize('FORMULAIRE.etat.combotypeetat.parcombat');
            case FLEAUX.typeDureeEtat.eParTour:
                return game.i18n.localize('FORMULAIRE.etat.combotypeetat.partour');
        }
    });

    /**
     * Get current user's role
     * @returns {boolean} True if current user is Game Master
     */
    Handlebars.registerHelper('getRoleLibelle', function() {
        return game.users.current.isGM;
    });

    /**
     * Get current user ID or use provided fallback
     * @param {string} fallback - Fallback value if no current user
     * @returns {string} Current user ID or fallback
     */
    Handlebars.registerHelper('getIsGM', function(fallback) {
        return game.users.current.isGM || fallback;
    });

    /**
     * Get user ID from given data or use current user
     * @param {string} fallback - Fallback value
     * @returns {string} User ID
     */
    Handlebars.registerHelper('userId', function(fallback) {
        return game.users.current.isGM || fallback;
    });

    /**
     * Check if item is modifiable based on category and type
     * @param {Object} item - Item object to check
     * @returns {boolean} True if item is modifiable
     */
    Handlebars.registerHelper('etatEstModifiable', function(item) {
        // Item is modifiable unless it's a specific condition with category 'etat' and type '3' and name 'handicape'
        return !(item.categorie === 'etat' && item.type === '3' && item.type === 'handicape');
    });
};

