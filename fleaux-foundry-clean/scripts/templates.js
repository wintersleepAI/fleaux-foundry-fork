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
    let templatesDialoguesPath = game.fleaux.templatesDialoguesPath;
    let templatesChatsPath = game.fleaux.templatesChatsPath;

    // Template file paths to preload
    const templatePaths = [
        // Actor sheet templates
        templatesActorsPath + 'character-sheet.hbs',
        templatesActorsPath + 'creature-sheet.hbs',
        templatesItemsPath + 'item-sheet.hbs',
        
        // Actor component templates
        templatesActorsPath + 'parts/actor-infos.hbs',
        templatesActorsPath + 'parts/actor-items.hbs',
        templatesActorsPath + 'parts/actor-items-etat.hbs',
        templatesActorsPath + 'parts/actor-items-commun.hbs',
        templatesActorsPath + 'parts/actor-items-arme.hbs',
        templatesActorsPath + 'parts/actor-items-armure.hbs',
        templatesActorsPath + 'parts/actor-items-objet.hbs',

        // Item sheet component templates
        templatesItemsPath + 'parts/item-header.hbs',
        templatesItemsPath + 'parts/item-macro.hbs',

        // Dialogue system templates
        templatesChatsPath + 'infobulle.hbs',
        templatesDialoguesPath + '/select-talent.hbs',
        templatesPath + 'des-usage.hbs',
        templatesDialoguesPath + '/niveau-experience.hbs',
        templatesDialoguesPath + '/select-profession.hbs',
        templatesPath + 'editor-box.hbs',

        // Chat system templates for dice results
        // templatesChatsPath + 'lancer-' + FLEAUX.rollTypeEnum.attributes + '.hbs',
        // templatesChatsPath + 'des-usage-' + FLEAUX.rollTypeEnum.usage + '.hbs',
        
        // templatesChatsPath + 'lancer-' + FLEAUX.rollTypeEnum.damage + '.hbs',
        
        // templatesChatsPath + 'des-usage-options.hbs',
        // templatesChatsPath + 'des-resultats.hbs'
    ];

    // Load all templates
    return loadTemplates(templatePaths);
};
