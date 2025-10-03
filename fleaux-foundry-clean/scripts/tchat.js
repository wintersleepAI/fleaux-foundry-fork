/**
 * Tchat - Chat system functions for Fleaux
 * Deobfuscated version of scripts/tchat.js
 */

/**
 * Display chat messages for dice roll successes and failures
 * Adds visual indicators for critical rolls and outcomes
 */
export const affichageTchatSuccesEchec = function(chatData, htmlFinder) {
    // Check if chat message and content are valid
    if (!chatData.system || !chatData.content) {
        return;
    }

    const rollData = chatData.system[0];
    const rollOptions = rollData.options;

    // Handle different dice roll types
    if (rollOptions?.typeLancerDes === FLEAUX.typeLancerDesEnum.eAttributs || 
        rollOptions?.typeLancerDes === FLEAUX.typeLancerDesEnum.eVolonte) {
        
        // Check for critical success (1) or critical failure (2)
        if (rollData.total === 1 || rollData.total === 2) {
            htmlFinder.find('.de-total').addClass('lance-critique');
        }
    } else {
        // Handle other dice types based on successful rolls
        if (rollOptions?.typeLancerDes === FLEAUX.typeLancerDesEnum.eUsage) {
            htmlFinder.find('.de-total').addClass(
                rollOptions?.succes ? 'lance-succes' : 'lance-echec'
            );
        }
    }
};
