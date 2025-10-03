/**
 * StateSheet.js - State Effect Item Sheet for Fleaux Foundry VTT Module
 * 
 * Item sheet for state effects/conditions in the Fleaux game system.
 * Provides interface for managing character state effects and conditions.
 */

import { ItemSheetAbstract } from './ItemSheetAbstract.js';

/**
 * State effect sheet class extending the abstract item sheet
 * Provides state-specific functionality for conditions and effects
 */
export class StateSheet extends ItemSheetAbstract {

    /**
     * Get default sheet options
     * @returns {Object} Sheet configuration
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            'template': game.fleaux.templatesItemsPath + game.fleaux.typeItem.etat + '-sheet.hbs'
        });
    }
}
