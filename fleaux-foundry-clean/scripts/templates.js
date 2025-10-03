/**
 * templates.js - Handlebars Template Preloader for Fleaux Foundry VTT Module
 * 
 * Automatically preloads all HTML templates used throughout the Fleaux system.
 * Ensures templates are available before sheet rendering and UI interactions.
 */

/**
 * Preloads all necessary Handlebars templates for the Fleaux system
 * @returns {Promise<void>} Promise resolving when all templates are loaded
 */
export const preloadHandlebarsTemplates = async function() {
    // Template path configurations
    let templatesActorsPath = game.fleaux.templatesActorsPath;
    let templatesPath = game.fleaux.templatesPath;
    let templatesItemsPath = game.fleaux.templatesItemsPath;
    let templatesDialoguesChemin = game.fleaux.templatesDialoguesChemin;
    let templatesTchatsChemin = game.fleaux.templatesTchatsChemin;

    // Template file paths to preload
    const templatePaths = [
        // Actor sheet templates
        templatesActorsPath + 'character-sheet.hbs',
        templatesActorsPath + 'creature-sheet.hbs',
        templatesActorsPath + 'item-sheet.hbs',
        
        // Actor component templates
        templatesPath + 'parts/actor-infos.hbs',
        templatesPath + 'parts/actor-items.hbs',
        templatesPath + 'parts/actor-items-etat.hbs',
        templatesPath + 'parts/actor-items-commun.hbs',
        templatesPath + 'parts/actor-items-arme.hbs',
        templatesPath + 'parts/actor-items-armure.hbs',
        templatesPath + 'parts/actor-items-objet.hbs',

        // Item sheet component templates
        templatesItemsPath + 'parts/item-header.hbs',
        templatesItemsPath + 'parts/item-macro.hbs',

        // Dialogue system templates
        templatesDialoguesChemin + 'infobulle.hbs',
        templatesDialoguesChemin + '/select-talent.hbs',
        templatesDialoguesChemin + 'des-usage.hbs',
        templatesDialoguesChemin + '/niveau-experience.hbs',
        templatesDialoguesChemin + '/select-profession.hbs',
        templatesDialoguesChemin + 'editor-box.hbs',

        // Chat system templates for dice results
        templatesTchatsChemin + 'lancer-' + FLEAUX.typeLancerDesEnum.eAttributs + '.hbs',
        templatesTchatsChemin + 'des-usage' + FLEAUX['typeLancerDesEnum'].eUsage + '.hbs',
        
        templatesTchatsChemin + 'lancer-' + FLEAUX['typeLancerDesEnum']['eDegats'] + '.hbs',
        
        templatesTchatsChemin + 'des-usage-options.hbs',
        templatesTchatsChemin + 'des-resultats.hbs'
    ];

    // Load all templates
    return loadTemplates(templatePaths);
};
