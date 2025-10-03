/**
 * CrimeSheet - Item Sheet for Crime (Accusation) Items
 * Deobfuscated version of scripts/items/CrimeSheet.js
 */

import { Repeater, Repeaters } from '../../libs/core-foundry/core-foundry.mjs';
import { ItemSheetAbstract } from './ItemSheetAbstract.js';

export class CrimeSheet extends ItemSheetAbstract {
    #repeaters = new Repeaters(new Repeater('accusations', null, 'accusation', [0, '']));

    /**
     * Default configuration for the Crime Sheet
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            template: game.fleaux.templatesItemsPath + game.fleaux.typeItem.crime + '-sheet.hbs',
            height: 'auto'
        });
    }

    /**
     * Get data for this sheet
     * Processes accusations array and localizes strings
     */
    getData(options) {
        let data = super.getData(options);
        const accusations = data?.system?.accusations;

        if (accusations.length) {
            for (let i = 0; i < accusations.length; i++) {
                const accusation = accusations[i];
                let number = i + 1;
                accusation[0] = number;
                accusation[1] = game.i18n.localize(accusation[1]);
            }
        }

        return super.getData(options);
    }

    /**
     * Activate event listeners for this sheet
     */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Handle repeater button clicks
        html.find('.repeater-bouton').click(this.onRepetearsActions.bind(this));
    }

    /**
     * Update the item with new data
     */
    _updateObject(event, formData) {
        // Update repeaters
        this.#repeaters.forEach(repeater => {
            repeater.update(formData);
        });
        
        return super._updateObject(event, formData);
    }

    /**
     * Handle actions on repeater buttons
     * Processes the accusations data
     */
    onRepetearsActions(event) {
        this.#repeaters[0].data = this.data.system.accusations;
        return this.#repeaters.onRepetearsActions(this, event);
    }
}
