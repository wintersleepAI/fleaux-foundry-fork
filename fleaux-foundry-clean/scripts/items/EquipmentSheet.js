/**
 * EquipmentSheet.js - Equipment Item Sheet for Fleaux Foundry VTT Module
 * 
 * Item sheet for equipment objects in the Fleaux game system.
 * Handles equipment stats, slot management, and usage dice functionality.
 */

import { ItemSheetAbstract } from './ItemSheetAbstract.js';

/**
 * Equipment sheet class extending the abstract item sheet
 * Provides equipment-specific functionality
 */
export class EquipmentSheet extends ItemSheetAbstract {

    /**
     * Get default sheet options
     * @returns {Object} Sheet configuration
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            'template': game.fleaux.templatesItemsPath + game.fleaux.itemType.equipment + '-sheet.hbs',
            'width': 700,
            'height': 'auto'
        });
    }

    /**
     * Generate data for template rendering
     * @param {Object} options - Rendering options
     * @returns {Object} Template data
     */
    getData(options) {
        const superData = super.getData(options);
        
        // Add Fleaux-specific data
        superData.attributs = FLEAUX.attributs;
        superData.typeItem = FLEAUX.typeItem;

        let equipementData = this.item;
        
        // Handle emplacement logic based on value
        equipementData.system.emplacement = equipementData.system.emplacement === '0' || equipementData.system.emplacement === '3' ? 
            null : 
            equipementData.system.emplacement === '2' ? 
                true : 
                false;

        return superData.item = equipementData;
        superData;
    }

    /**
     * Activate event listeners for equipment-specific interactions
     * @param {HTMLHtmlElement} html - Sheet HTML element
     */
    activateListeners(html) {
        super.activateListeners(html);

        // Usage dice roll functionality
        html.find('.roll-des-usage').click(event => {
            event.preventDefault();
            
            let targetElement = $(event.currentTarget);
            let itemName = targetElement.data('item-name');
            let usageDie = targetElement.data('deUsage');

            // Roll usage dice for the equipment
            this.item.lancerDesUsage(itemName, usageDie);
        });
    }
}