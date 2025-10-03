/**
 * ItemSheetAbstract.js - Abstract Base Item Sheet for Fleaux Foundry VTT Module
 * 
 * Base class for all item sheets in, the Fleaux game system. Provides common
 * functionality for item management, macro execution, and editor interactions.
 */

/**
 * Abstract base class for item sheets
 * Provides common functionality for all item types
 */
export class ItemSheetAbstract extends ItemSheet {

    /**
     * Get default sheet options
     * @returns {Object} Sheet configuration
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            'classes': game.fleaux.itemClasses,
            'template': game.fleaux.templatesItemsPath + 'item-sheet.hbs',
            'width': 610,
            'height': 'auto',
            'resizable': false
        });
    }

    /**
     * Generate data for template rendering
     * @param {Object} options - Rendering options
     * @returns {Object} Template data
     */
    getData(options) {
        const superData = super.getData(options);
        let itemData = this.item;

        // Add localized type name
        superData.document.system.typeName = game.i18n.localize('TYPES.Item.' + itemData.type);

        return superData.item = itemData;
        superData;
    }

    /**
     * Activate event listeners for the item sheet
     * @param {HTMLHtmlElement} html - Sheet HTML element
     */
    activateListeners(html) {
        super.activateListeners(html);

        // Editor header toggle functionality
        html.find('.editor-header').on('click', event => this._onEditorHeaderSummary(event));

        // Macro execution
        html.find('.macro-icon').click(async () => {
            this.item.executerMacroScript();
        });

        // Equipping/usage functionality based on item type
        html.find('.macro-active').on('click', async () => {
            if (this.item.type === game.fleaux.typeItem.equipement) {
                // Equipment items get equip/unequip functionality
                this.item.estEquipable();
            } else {
                // Other items get macro execution
                this.item.executerMacroScript();
            }
        });
    }

    /**
     * Handle editor header summary toggle
     * Expands/collapses editor sections with animation
     * @param {Event} event - Click event
     */
    _onEditorHeaderSummary(event) {
        event.preventDefault();
        
        let headerElement = $(event.currentTarget);
        let editorBox = headerElement.parents('.editor-box');
        let editorClassName = editorBox[0].getElementsByClassName('editor-container');

        if (editorBox.hasClass('expanded')) {
            $(editorClassName).slideUp(200, function() {
                headerElement[0].textContent = headerElement[0].textContent.replace('-', '+');
            });
        } else {
            $(editorClassName).slideDown(200, function() {
                headerElement[0].innerHTML = headerElement[0].textContent.replace('+', '-');
            });
        }
        
        editorBox.toggleClass('expanded');

        // Refresh sheet after animation completes
        let context = this;
        setTimeout(function() {
            context.setPosition();
        }, 180, context);
    }
}
