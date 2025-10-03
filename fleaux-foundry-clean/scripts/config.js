/**
 * Configuration and Constants for Fléaux RPG System
 * Deobfuscated and translated version of the original config.js
 */

const FLEAUX = {
    /**
     * Get user by actor with optional active filter
     * @param {Object} actor - The actor to find user for
     * @param {boolean} active - Filter for active users only
     * @returns {Object} User associated with the actor
     */
    getUserByActor(actor, active = true) {
        return Array.from(game.users)
            .filter(user => !user.isGM && user.active === active)
            .find(user => user.character.id === actor.id);
    }
};

// Initialize data arrays
FLEAUX.bestiary = [];
FLEAUX.attributes = [];
FLEAUX.peoples = [];
FLEAUX.crimes = [];
FLEAUX.professions = [];
FLEAUX.equipment = [];
FLEAUX.talents = [];
FLEAUX.spells = [];

/**
 * Dice roll type enumeration
 * Maps roll types to their string identifiers
 */
FLEAUX.rollTypeEnum = Object.freeze({
    attributes: 'dice-attributes',    // Attribute rolls
    willpower: 'dice-willpower',       // Willpower rolls
    damage: 'dice-damage',             // Damage rolls
    usage: 'dice-usage'                // Usage rolls
});

/**
 * Usage type enumeration
 * Different types of usage rolls for equipment/skills
 */
FLEAUX.usageDieEnum = Object.freeze({
    equipment: 'dice-usage-equipment',  // Equipment usage
    spell: 'dice-usage-spell',          // Spell usage
    damage: FLEAUX.rollTypeEnum.damage,
    weaponDamage: FLEAUX.rollTypeEnum.damage + '-weapon'
});

/**
 * Dice advantage/disadvantage type enumeration
 * -1 = Disadvantage, 0 = Normal, 1 = Advantage
 */
FLEAUX.diceType = Object.freeze({
    disadvantage: -1,
    normal: 0,
    advantage: 1
});

/**
 * Attack type enumeration
 * Different types of attacks (melee, ranged, both)
 */
FLEAUX.attackType = Object.freeze({
    melee: 'melee',      // Melee attacks
    ranged: 'ranged',    // Ranged attacks
    both: 'melee-ranged' // Both melee and ranged
});

/**
 * State duration type enumeration
 * Different duration types for character states/conditions
 */
FLEAUX.stateDurationType = Object.freeze({
    permanent: 'permanent',    // Permanent effect
    perSession: 'per-session', // Per session
    perDay: 'per-day',         // Per day
    perScene: 'per-scene',     // Per scene
    perCombat: 'per-combat',   // Per combat
    perTurn: 'per-turn'        // Per turn
});

/**
 * Distance enumeration for combat positioning
 * Different distance ranges in game units
 */
FLEAUX.distance = Object.freeze({
    adjacent: 1,     // Adjacent/melee range
    close: 6,        // Close range
    far: 12,         // Far range
    distant: 100     // Very distant
});

