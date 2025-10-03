/**
 * CreatureSheet.js - Creature Sheet for Fleaux Foundry VTT Module
 * 
 * Actor sheet for creatures/monsters in the Fleaux game system.
 * Provides a simpler interface compared to player character sheets,
 * focusing on creature statistics, actions, and combat mechanics.
 */

import { Repeater, Repeaters } from '../../libs/core-foundry/core-foundry.mjs';

/**
 * Creature sheet class for creature actors (monsters, NPCs)
 * Provides basic actor functionality with action management
 */
export class CreatureSheet extends ActorSheet {
    
    /** @type {Repeaters} Private repeater manager for creature actions */
    #repeaters = new Repeaters(
        new Repeater('action', null, 'system', ['', '', 0])
    );

    /**
     * Get default sheet options
     * @returns {Object} Sheet configuration
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            'classes': game.fleaux.acteurClasses,
            'template': game.fleaux.templatesActorsPath + 'creature-sheet.hbs',
            'width': 900,
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
        const actorData = superData.actor;

        // Add localized type name
        superData.action.system.typeName = game.i18n.localize('TYPES.Actor.' + actorData.type);

        // Translate action names and descriptions
        const actorsActions = actorData?.system?.actions;
        if (actorsActions && actorsActions.length) {
            for (let actionIndex = 0; actionIndex < actorsActions.length; actionIndex++) {
                const currentAction = actorsActions[actionIndex];
                // Localize action name and description
                currentAction[0] = game.i18n.localize(currentAction[0]);
                currentAction[1] = game.i18n.localize(currentAction[1]);
            }
        }

        return superData.actor = actorData;
        superData;
    }

    /**
     * Activate event listeners for the creature sheet
     * @param {HTMLHtmlElement} html - Sheet HTML element
     */
    activateListeners(html) {
        super.activateListeners(html);

        // Only enable interactions for sheet owner
        if (!this.options.editable) {
            return;
        }

        // Bind repeater button handlers
        html.find('.repeater-bouton').on('click', event => this._surRepetiteurs(event));
        
        // Bind fortune calculation
        html.find('.calculer-fortune').on('click', this.calculerFortune.bind(this));

        // Handle hit point changes for creature death
        html.find('.pv-actuel').on('change', async event => {
            const targetInput = $(event.currentTarget)[0];
            let creatureToken = (game.scenes?.active?.tokens?.find(token => token?.actorId === this.actor.id))?.actor;
            
            // Toggle dead status effect on token
            creatureToken.actor?.toggleStatusEffect('dead', {
                'active': Number(targetInput?.value) <= 0,
                'overlay': false
            });
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
                headerElement[0].textContent = headerElement[0].textContent.replace('+', '-');
            });
        }
        
        editorBox.toggleClass('expanded');

        // Refresh sheet after animation completes
        let context = this;
        setTimeout(function() {
            context.render();
        }, 180, context);
    }

    /**
     * Update object with changes
     * @param {Object} formData - Form data to update
     * @param {Object|Promise} options - Update options
     * @returns {Promise} Update promise
     */
    async _updateObject(formData, options) {
        // Update all repeaters with form data
        this.#repeaters.forEach(repeaterInstance => {
            repeaterInstance.update(formData);
        });

        // Call parent update method
        return super._updateObject(formData, options);
    }

    /**
     * Handle repeater interactions
     * Manages creature actions and other repeatable elements
     * @param {Event} event - Click event
     */
    onRepetearsActions = event => {
        // Update repeater data source with current actor actions
        this.#repeaters[0].source = this.actor.system.actions;
        
        // Execute repeater rendering or action
        this.#repeaters.forEach(this, event);
    }
}
