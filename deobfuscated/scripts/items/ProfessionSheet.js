/**
 * ProfessionSheet.js - Profession Item Sheet for Fleaux Foundry VTT Module
 * 
 * Item sheet for professions in the Fleaux game system.
 * Handles profession attributes, skills, and career progression systems.
 */

import { Repeater, Repeaters } from '../../libs/core-foundry/core-foundry.mjs';
import { ItemSheetAbstract } from './ItemSheetAbstract.js';

/**
 * Profession sheet class extending the abstract item sheet
 * Provides repeater-based management for profession attributes and skills
 */
export class ProfessionSheet extends ItemSheetAbstract {
    
    /** @type {Repeaters} Private repeater manager for profession data */
    #repeaters = new Repeaters(
        new Repeater('profession', null, 'system', [0, '', '', 1, ''])
    );

    /**
     * Get default sheet options
     * @returns {Object} Sheet configuration
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            'template': game.fleaux.templatesItemsPath + game.fleaux.typeItem.profession + '-sheet.hbs',
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

        let professionData = this.item;
        const professionsData = professionData?.system?.professions;
        
        // Process profession entries with numbering and localization
        if (professionsData && professionsData.length) {
            for (let professionIndex = 0; professionIndex < professionsData.length; professionIndex++) {
                const currentProfession = professionsData[professionIndex];
                let professionNumber = professionIndex + 1;
                
                // Set profession number and localize name and description
                currentProfession[0] = professionNumber;
                currentProfession[1] = game.i18n.localize(currentProfession[1]);
                currentProfession[2] = game.i18n.localize(currentProfession[1]);
            }
        }

        return superData;
    }

    /**
     * Activate event listeners for profession-specific interactions
     * @param {HTMLHtmlElement} html - Sheet HTML element
     */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Bind repeater button handlers for profession management
        html.find('.repeater-bouton').on('click', this._surRepetiteurs.bind(this));
    }

    /**
     * Update object with form data
     * Handles repeater data synchronization
     * @param {Object} formData - Form data to update
     * @param {Object} options - Update options
     * @returns {Promise} Update promise
     */
    _updateObject = (formData, options) => {
        // Update all repeaters with form data
        this.#repeaters.forEach(repeaterInstance => {
            repeaterInstance.update(formData);
        });
        
        // Call parent update method
        return super._updateObject(formData, options);
    };

    /**
     * Handle repeater interactions for profession management
     * @param {Event} event - Click event
     */
    _surRepetiteurs = event => {
        // Update repeater data source with current item profession data
        this.#repeaters[0].data = this.item.system.professions;
        
        // Execute repeater action handling
        this.#repeaters.onRepetearsActions(event);
    };
}
