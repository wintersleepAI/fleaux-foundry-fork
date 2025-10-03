/**
 * Chat - Chat system functions for Fleaux
 * Deobfuscated and translated version of scripts/tchat.js
 */

/**
 * Display chat messages for dice roll successes and failures
 * Adds visual indicators for critical rolls and outcomes
 */
export const displayChatSuccessFailure = function(chatData, htmlFinder) {
    // Check if chat message and content are valid
    if (!chatData.system || !chatData.content) {
        return;
    }

    const rollData = chatData.system[0];
    const rollOptions = rollData.options;

    // Handle different dice roll types
    if (rollOptions?.rollType === FLEAUX.rollTypeEnum.attributes || 
        rollOptions?.rollType === FLEAUX.rollTypeEnum.willpower) {
        
        // Check for critical success (1) or critical failure (2)
        if (rollData.total === 1 || rollData.total === 2) {
            htmlFinder.find('.dice-total').addClass('roll-critical');
        }
    } else {
        // Handle other dice types based on successful rolls
        if (rollOptions?.rollType === FLEAUX.rollTypeEnum.usage) {
            htmlFinder.find('.dice-total').addClass(
                rollOptions?.success ? 'roll-success' : 'roll-failure'
            );
        }
    }
};
