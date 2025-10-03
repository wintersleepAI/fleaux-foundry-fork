/**
 * Settings - System settings registry for Fleaux
 * Deobfuscated version of scripts/settings.js
 */

/**
 * Register system settings for the Fleaux Foundry RPG system
 */
export const registerSystemSettings = function() {
    // Register import data setting
    game.settings.register(
        game.fleaux.system.id, 
        'importData', 
        {
            name: game.i18n.localize('SETTINGS.importData.name'),
            hint: game.i18n.localize('SETTINGS.importData.hint'),
            scope: 'world',
            config: true,
            default: false,
            type: Boolean,
            onChange: setting => window.location.reload()
        }
    );
};
