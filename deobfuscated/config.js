/**
 * Configuration and Constants for Fléaux RPG System
 * Deobfuscated version of the original config.js
 */

const FLEAUX = {
    /**
     * Get user by actor with optional active filter
     * @param {Object} actor - The actor to find user for
     * @param {boolean} active - Filter for active users only
     * @returns {Object} User associated with the actor
     */
    getUtilisateurParActeur(actor, active = true) {
        return Array.from(game.users)
            .filter(user => !user.isGM && user.active === active)
            .find(user => user.character.id === actor.id);
    }
};

// Initialize data arrays
FLEAUX.bestiaire = [];
FLEAUX.attributs = [];
FLEAUX.peuples = [];
FLEAUX.crimes = [];
FLEAUX.professions = [];
FLEAUX.equipements = [];
FLEAUX.talents = [];
FLEAUX.sorts = [];

/**
 * Dice roll type enumeration
 * Maps roll types to their string identifiers
 */
FLEAUX.typeLancerDesEnum = Object.freeze({
    eAttributs: 'de-attributs',    // Attribute rolls
    eVolonte: 'de-volonte',         // Willpower rolls
    eDegats: 'de-degats',          // Damage rolls
    eUsage: 'de-usage'             // Usage rolls
});

/**
 * Usage type enumeration
 * Different types of usage rolls for equipment/skills
 */
FLEAUX.deUsageEnum = Object.freeze({
    eEquipement: 'de-usage-equipement',  // Equipment usage
    eSort: 'de-usage-sort',             // Spell usage
    eDegats: FLEAUX.typeLancerDesEnum.eDegats,
    eDegatsArme: FLEAUX.typeLancerDesEnum.eDegats + '-arme'
});

/**
 * Dice advantage/disadvantage type enumeration
 * -1 = Disadvantage, 0 = Normal, 1 = Advantage
 */
FLEAUX.typeDes = Object.freeze({
    eDesavantage: -1,
    eNormal: 0,
    eAvantage: 1
});

/**
 * Attack type enumeration
 * Different types of attacks (melee, ranged, both)
 */
FLEAUX.typeAttaque = Object.freeze({
    eMelee: 'melee',      // Melee attacks
    eTir: 'tir',          // Ranged attacks
    eLesdeux: 'melee-tir' // Both melee and ranged
});

/**
 * State duration type enumeration
 * Different duration types for character states/conditions
 */
FLEAUX.typeDureeEtat = Object.freeze({
    ePermanent: 'permanent',    // Permanent effect
    eParPartie: 'par-partie',   // Per session
    eParJournee: 'par-journee', // Per day
    eParScene: 'par-scene',     // Per scene
    eParCombat: 'par-combat',   // Per combat
    eParTour: 'par-tour'        // Per turn
});

/**
 * Distance enumeration for combat positioning
 * Different distance ranges in game units
 */
FLEAUX.distance = Object.freeze({
    eAdjacent: 1,     // Adjacent/melee range
    eProche: 6,       // Close range
    eLointain: 12,    // Far range
    eDistant: 100     // Very distant
});

