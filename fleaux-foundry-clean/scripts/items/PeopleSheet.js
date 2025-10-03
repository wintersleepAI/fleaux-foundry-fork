/**
 * PeopleSheet.js - People/Nation Item Sheet for Fleaux Foundry VTT Module
 * 
 * Item sheet for people/nation backgrounds in the Fleaux game system.
 * Handles education systems, attribute bonuses, and cultural backgrounds.
 */

import { Repeater, Repeaters } from '../../libs/core-foundry/core-foundry.mjs';
import { ItemSheetAbstract } from './ItemSheetAbstract.js';

/**
 * People/Nation sheet class extending the abstract item sheet
 * Provides repeater-based management for education systems
 */
export class PeopleSheet extends ItemSheetAbstract {
    
    /** @type {Repeaters} Private repeater manager for education system */
    #repeaters = new Repeaters(
        new Repeater('education', null, 'system', [0, '', 1, ''])
    );

    /**
     * Get default sheet options
     * @returns {Object} Sheet configuration
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            'template': game.fleaux.templatesItemsPath + game.fleaux.typeItem.peuple + '-sheet.hbs',
            'width': 720,
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

        let peupleData = this.item;
        const educationsData = peupleData?.system?.education;
        
        // Process education entries with numbering and localization
        if (educationsData && educationsData.length) {
            for (let educationIndex = 0; educationIndex < educationsData.length; educationIndex++) {
                const currentEducation = educationsData[educationIndex];
                let educationNumber = educationIndex + 1;
                
                // Set education number and localize description
                currentEducation[0] = educationNumber;
                currentEducation[1] = game.i18n.localize(currentEducation[1]);
            }
        }

        return superData;
    }

    /**
     * Activate event listeners for people-specific interactions
     * @param {HTMLHtmlElement} html - Sheet HTML element
     */
    activateListeners(html) {
        // Bind repeater button handlers for education management
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
     * Handle repeater interactions for education system
     * @param {Event} event - Click event
     */
    _surRepetiteurs = event => {
        // Update repeater data source with current item education data
        this.#repeaters[0].data = this.item.system.education;
        
        // Execute repeater action handling
        this.#repeaters.onRepetearsActions(event);
    };
}
