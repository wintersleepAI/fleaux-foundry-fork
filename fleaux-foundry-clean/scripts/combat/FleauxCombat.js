/**
 * FleauxCombat.js - Combat System for Fleaux Foundry VTT Module
 * 
 * Extended combat system for the Fleaux game. Provides customized
 * initiative rolling using the Cool attribute for combat.
 */

/**
 * Fleaux combat class extending the base Foundry Combat system
 * Implements initiative using Cool rolls
 */
export class FleauxCombat extends Combat {

    /**
     * Roll initiative for combatants
     * Uses Cool attribute for initiative determination
     * @param {string|Array} combatants - Combatant ID or array of IDs
     * @param {Object} options - Initiative roll options  
     * @returns {Promise<Combat>} Updated combat instance
     */
    async rollInitiative(combatants, options = {}) {
        // Normalize combatant parameter to array
        combatants = typeof combatants === 'string' ? [combatants] : combatants;

        // Process each combatant for initiative
        for (let [combatantIndex, combatantId] of combatants.entries()) {
            const combatant = this.combatants.get(combatantId);
            
            // Skip if combatant doesn't exist or has no actor
            if (!combatant?.actor) {
                return null;
            }

            // Roll Cool for initiative (force initiative = true)
            await combatant.actor.rollAttributes('cool', true);
        }

        return this;
    }

    /**
     * Determine next combat turn
     * Override parent method to handle Fleaux-specific turn order
     * @param {String} combatantId - Combatant ID
     * @param {Object} options - Turn options
     * @returns {Promise<number>} Next turn number
     */
    async nextTurn(combatantId, options = {}) {
        // Call parent nextTurn method
        return await super.nextTurn(combatantId, options);
    }

    /**
     * Handle combatant updates during combat
     * @param {Object} updates - Combatant updates
     * @param {Object} options - Update options
     * @returns {Promise} Update result
     */
    async updateCombatant(updates, options = {}) {
        // Handle Fleaux-specific combatant state changes
        return await super.updateCombatant(updates, options);
    }

    /**
     * End turn and advance combat
     * @param {Object} options - Turn advancement options
     * @returns {Promise<Combat>} Updated combat instance
     */
    async nextRound(options = {}) {
        // Handle round advancement with Fleaux rules
        return await super.nextRound(options);
    }

    /**
     * Get combat statistics
     * @returns {Object} Combat statistics and state
     */
    getCombatData() {
        const combatData = {
            round: this.round,
            turn: this.turn,
            combatantCount: this.combatants.size,
            activeCombatant: this.combatant,
            initiativeOrder: []
        };

        // Sort combatants by initiative for display
        this.combatants.forEach(combatant => {
            combatData.initiativeOrder.push({
                id: combatant.id,
                name: combatant.name,
                initiative: combatant.initiative,
                actor: combatant.actor?.name || 'Unknown'
            });
        });

        combatData.initiativeOrder.sort((a, b) => b.initiative - a.initiative);

        return combatData;
    }

    /**
     * Handle combat start
     * Initialize Fleaux-specific combat state
     * @param {Object} options - Combat start options
     * @returns {Promise<Combat>} Combat instance
     */
    async startCombat(options = {}) {
        // Initialize Fleaux combat systems
        // Example: Set up state tracking, initialize effects, etc.
        
        return await super.startCombat(options);
    }

    /**
     * Handle combat end
     * Clean up Fleaux-specific combat state
     * @param {Object} options - Combat end options
     * @returns {Promise<Combat>} Combat instance
     */
    async endCombat(options = {}) {
        // Clean up Fleaux combat systems
        // Example: Remove temporary effects, reset states, etc.
        
        return await super.endCombat(options);
    }

    /**
     * Get initiative formula for a combatant
     * @param {Combatant} combatant - Combatant instance
     * @returns {string} Initiative formula
     */
    getInitiativeFormula(combatant) {
        // Default Fleaux initiative uses Sang-froid roll
        return '1d20 + @attributs.sfr.value';
    }

    /**
     * Validate combatant state
     * @param {Combatant} combatant - Combatant to validate
     * @returns {boolean} Whether combatant is valid for combat
     */
    validateCombatant(combatant) {
        // Fleaux-specific validation
        if (!combatant.actor) {
            return false;
        }

        // Ensure actor has Sang-froid attribute
        if (!combatant.actor.system?.attributs?.sfr) {
            console.warn(`Actor ${combatant.actor.name} missing Sang-froid attribute for combat`);
            return false;
        }

        return true;
    }
}
