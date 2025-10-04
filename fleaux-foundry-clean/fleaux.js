/**
 * Main Fléaux RPG System Module for Foundry VTT
 * Deobfuscated and translated version of the original fleaux.js
 */

// Import core functionality
import { 
    Compendium as CompendiumManager 
} from './libs/core-foundry/core-foundry.mjs';

// Import game classes
import { FleauxDes } from './scripts/FleauxDes.js';
import { FleauxActor } from './scripts/actors/FleauxActor.js';
import { FleauxCombat } from './scripts/combat/FleauxCombat.js';

// Import character sheets
import { CharacterSheet } from './scripts/actors/CharacterSheet.js';
import { CreatureSheet } from './scripts/actors/CreatureSheet.js';

// Import item sheets
import { CrimeSheet } from './scripts/items/CrimeSheet.js';
import { EquipmentSheet } from './scripts/items/EquipmentSheet.js';
import { StateSheet } from './scripts/items/StateSheet.js';
import { FleauxItem } from './scripts/items/FleauxItem.js';
import { ItemSheetAbstract } from './scripts/items/ItemSheetAbstract.js';
import { PeopleSheet } from './scripts/items/PeopleSheet.js';
import { ProfessionSheet } from './scripts/items/ProfessionSheet.js';

// Import utility modules
import * as chatModule from './scripts/chat.js';
import { registerHandlebarsHelpers } from './scripts/helpers.js';
import { preloadHandlebarsTemplates } from './scripts/templates.js';

let socket = null;

/**
 * Initialize the system when socketlib is ready
 */
Hooks.once('socketlib.ready', async function() {
    console.log('Initializing Fleaux system...');
    
    // Set logo and home URL
    //changeLogo(null, 'https://foundryvtt.wiki/fr/home');
    
    // Configure game paths and settings
    game.fleaux = {
        jsonsPath: 'systems/' + game.system.id + '/_jsons/',
        templatesPath: 'systems/' + game.system.id + '/templates/',
        templatesActorsPath: 'systems/' + game.system.id + '/templates/actors/',
        templatesItemsPath: 'systems/' + game.system.id + '/templates/items/',
        templatesDialoguesPath: 'systems/' + game.system.id + '/templates/dialogues/',
        templatesChatsPath: 'systems/' + game.system.id + '/templates/tchats/',
        imagesPath: 'systems/' + game.system.id + '/images/',
        
        // Actor types
        actorType: {
            character: 'character',
            npc: 'npc',
            creature: 'creature'
        },
        
        // Item types
        itemType: {
            attribute: 'attribute',
            people: 'people',
            crime: 'crime',
            profession: 'profession',
            talent: 'talent',
            spell: 'spell',
            equipment: 'equipment',
            state: 'state'
        },
        
        // Type item mapping (alias for itemType)
        typeItem: {
            attribute: 'attribute',
            people: 'people',
            crime: 'crime',
            profession: 'profession',
            talent: 'talent',
            spell: 'spell',
            equipment: 'equipment',
            state: 'state',
            commun: 'common'
        },
        
        config: FLEAUX,
        itemClasses: ['fleaux', 'item', 'talent'],
        actorClasses: ['fleaux', 'item', 'npc', 'character'],
        dice: FleauxDes,
        socket: socket,
        CHAT_TEMPLATE: {
            TOOLTIP_TEMPLATE: 'systems/fleaux/templates/tchats/infobulle.hbs',
            CHAT_TEMPLATE: 'systems/fleaux/templates/tchats/lancer-des-dialogue.html'
        }
    };

    // Set system title
    game.system.title = 'SYSTEM.label';
    
    // Configure core systems
    CONFIG.Combat.documentClass = FleauxCombat;
    CONFIG.Actor.documentClass = FleauxActor;
    CONFIG.Item.documentClass = FleauxItem;
    CONFIG.Macro.documentClass = 'systems/fleaux/images/ui/macro-script.webp';
    
    // Configure compendium banners
    CONFIG.Scene.compendiumBanner = 'systems/fleaux/images/ui/compendiums.png';
    CONFIG.RollTable.compendiumBanner = 'systems/fleaux/images/ui/compendiums.png';
    CONFIG.JournalEntry.compendiumBanner = 'systems/fleaux/images/ui/compendiums.png';
    
    // Register dice configuration
    CONFIG.Dice.rolls.push(FleauxDes);
    
    // Register actor sheets
    let fleauxSystem = game.fleaux;
    Actors.unregisterSheet('core', ActorSheet);
    
    // Character sheet
    Actors.registerSheet('fleaux', CharacterSheet, {
        types: [fleauxSystem.actorType.character],
        makeDefault: true,
        label: 'TYPES.Actor.character'
    });
    
    // NPC sheet
    Actors.registerSheet('fleaux', CharacterSheet, {
        types: [fleauxSystem.actorType.npc],
        makeDefault: true,
        label: 'TYPES.Actor.npc'
    });
    
    // Creature sheet
    Actors.registerSheet('fleaux', CreatureSheet, {
        types: [fleauxSystem.actorType.creature],
        makeDefault: true,
        label: 'TYPES.Actor.creature'
    });
    
    // Register item sheets
    Items.unregisterSheet('core', ItemSheet);
    
    Items.registerSheet('fleaux', ItemSheetAbstract, {
        types: [fleauxSystem.itemType.attribute],
        makeDefault: true,
        label: 'TYPES.Item.attribute'
    });
    
    Items.registerSheet('fleaux', PeopleSheet, {
        types: [fleauxSystem.itemType.people],
        makeDefault: true,
        label: 'TYPES.Item.people'
    });
    
    Items.registerSheet('fleaux', CrimeSheet, {
        types: [fleauxSystem.itemType.crime],
        makeDefault: true,
        label: 'TYPES.Item.crime'
    });
    
    Items.registerSheet('fleaux', ProfessionSheet, {
        types: [fleauxSystem.itemType.profession],
        makeDefault: true,
        label: 'TYPES.Item.profession'
    });
    
    Items.registerSheet('fleaux', ItemSheetAbstract, {
        types: [fleauxSystem.itemType.talent],
        makeDefault: true,
        label: 'TYPES.Item.talent'
    });
    
    Items.registerSheet('fleaux', ItemSheetAbstract, {
        types: [fleauxSystem.itemType.spell],
        makeDefault: true,
        label: 'TYPES.Item.spell'
    });
    
    Items.registerSheet('fleaux', EquipmentSheet, {
        types: [fleauxSystem.itemType.equipment],
        makeDefault: true,
        label: 'TYPES.Item.equipment'
    });
    
    Items.registerSheet('fleaux', StateSheet, {
        types: [fleauxSystem.itemType.state],
        makeDefault: true,
        label: 'TYPES.Item.state'
    });
    
    // Preload templates and register helpers
    preloadHandlebarsTemplates();
    registerHandlebarsHelpers();
    
    game.systemInitialized = false;
});

/**
 * Ready hook - Initialize compendiums and data
 */
Hooks.once('ready', async () => {
    //addTicketTrackingUrl();
    
    let systemData = game.system.debug.system;
    
    // Only GM should configure compendiums
    if (game.user.isGM) {
        // Configure table compendium
        CompendiumManager.configure(
            systemData.packs[8].name,
            game.i18n.localize('TABLES.minuscule.nom')
        );
        
        // Configure scenes compendium
        CompendiumManager.configure(
            systemData.packs[9].name,
            game.i18n.localize('SCENES.minuscule.nom')
        );
        
        // Load and lock tables
        await CompendiumManager.getContent(systemData.packs[9].name)
            .then(async (data) => {
                await CompendiumManager.find(systemData.packs[9].name)
                    .update({locked: false});
                
                data.forEach(table => {
                    table.update({name: game.i18n.localize(table.system.resourceKey)});
                });
            });
        
        // Import various compendium data
        await CompendiumManager.import(systemData.packs[0].name, game.fleaux.jsonsPath, game.i18n.localize('BESTIARY.minuscule.nom'));
        await CompendiumManager.import(systemData.packs[1].name, game.fleaux.jsonsPath, game.i18n.localize('ATTRIBUTES.minuscule.nom'));
        await CompendiumManager.import(systemData.packs[2].name, game.fleaux.jsonsPath, game.i18n.localize('PEOPLES.minuscule.nom'));
        await CompendiumManager.import(systemData.packs[3].name, game.fleaux.jsonsPath, game.i18n.localize('CRIMES.minuscule.nom'));
        await CompendiumManager.import(systemData.packs[4].name, game.fleaux.jsonsPath, game.i18n.localize('PROFESSIONS.minuscule.nom'));
        await CompendiumManager.import(systemData.packs[5].name, game.fleaux.jsonsPath, game.i18n.localize('EQUIPMENT.minuscule.nom'));
        await CompendiumManager.import(systemData.packs[6].name, game.fleaux.jsonsPath, game.i18n.localize('TALENTS.minuscule.nom'));
        await CompendiumManager.import(systemData.packs[7].name, game.fleaux.jsonsPath, game.i18n.localize('SPELLS.minuscule.nom'));
        
        // Configure ownership for different compendiums
        await CompendiumManager.configure(systemData.packs[0].name, {
            locked: true,
            ownership: {
                GAMEMASTER: 'OWNER',
                ASSISTANT: 'OWNER',
                TRUSTED: 'OBSERVER',
                PLAYER: 'NONE'
            }
        });
        
        await CompendiumManager.configure(systemData.packs[1].name, {
            locked: true,
            ownership: {
                GAMEMASTER: 'OWNER',
                ASSISTANT: 'OWNER',
                TRUSTED: 'OBSERVER',
                PLAYER: 'OBSERVER'
            }
        });
        
        await CompendiumManager.configure(systemData.packs[2].name, {
            locked: true,
            ownership: {
                GAMEMASTER: 'OWNER',
                ASSISTANT: 'OWNER',
                TRUSTED: 'OBSERVER',
                PLAYER: 'NONE'
            }
        });
        
        await CompendiumManager.configure(systemData.packs[3].name, {
            locked: true,
            ownership: {
                GAMEMASTER: 'OWNER',
                ASSISTANT: 'OWNER',
                TRUSTED: 'NONE',
                PLAYER: 'NONE'
            }
        });
        
        await CompendiumManager.configure(systemData.packs[4].name, {
            locked: true,
            ownership: {
                GAMEMASTER: 'OWNER',
                ASSISTANT: 'OWNER',
                TRUSTED: 'OBSERVER',
                PLAYER: 'OBSERVER'
            }
        });
        
        await CompendiumManager.configure(systemData.packs[5].name, {locked: true});
        await CompendiumManager.configure(systemData.packs[6].name, {locked: true});
        await CompendiumManager.configure(systemData.packs[7].name, {locked: true});
        
        await CompendiumManager.configure(systemData.packs[8].name, {
            locked: true,
            ownership: {
                GAMEMASTER: 'OWNER',
                ASSISTANT: 'OWNER',
                TRUSTED: 'NONE',
                PLAYER: 'OBSERVER'
            }
        });
        
        await CompendiumManager.configure(systemData.packs[9].name, {
            locked: true,
            ownership: {
                GAMEMASTER: 'OWNER',
                ASSISTANT: 'OWNER',
                TRUSTED: 'NONE',
                PLAYER: 'OBSERVER'
            }
        });
    }

    // Load compendium content into global arrays
    FLEAUX.bestiary = await CompendiumManager.getContent(systemData.packs[0].name);
    FLEAUX.attributes = await CompendiumManager.getContent(systemData.packs[1].name);
    FLEAUX.peoples = await CompendiumManager.getContent(systemData.packs[2].name);
    FLEAUX.crimes = await CompendiumManager.getContent(systemData.packs[3].name);
    FLEAUX.professions = await CompendiumManager.getContent(systemData.packs[4].name);
    FLEAUX.equipment = await CompendiumManager.getContent(systemData.packs[5].name);
    FLEAUX.talents = await CompendiumManager.getContent(systemData.packs[6].name);
    FLEAUX.spells = await CompendiumManager.getContent(systemData.packs[7].name);
    
    console.log('Fleaux system initialization complete.');
    await cleanupMacros();
    console.log('Cleaned up obsolete macros.');
});

/**
 * Rendering hooks
 */
Hooks.on('renderApplication', () => {
    let pauseImage = document.querySelector('#pause img');
    pauseImage.setAttribute('src', 'systems/fleaux/images/ui/tete-de-mort.png');
    pauseImage.style.position = 'fixed';
    pauseImage.style.height = '10vw';
    pauseImage.style.width = '10vw';
    pauseImage.style.left = '-10vw';
    pauseImage.style.opacity = '1';
});

Hooks.on('renderChatMessage', async (message, html, data) => {
    chatModule.displayChatSuccessFailure(message, html, data);
});

/**
 * Socketlib initialization
 */
Hooks.once('socketlib.ready', () => {
    socket = socketlib.register('fleaux');
    
    // Register socket functions
    socket.register('disarm', disarm);
    socket.register('applyDamage', applyDamage);
    socket.register('panicScream', panicScream);
});

/**
 * Socket functions for Game Master interactions
 */

function disarm(actorId) {
    return game.actors.get(actorId).disarmEnemy();
}

function applyDamage(actorId, tokenIds, damages, isPublic = true) {
    let tokens = [];
    tokenIds.forEach(tokenId => {
        tokens.push((
            game.scenes?.active?.tokens?.find(token => token?.actorId === tokenId)
        )?.object);
    });
    game.actors.get(actorId).applyDamage(tokens, damages, isPublic);
}

function panicScream(actorId) {
    const actor = game.actors.get(actorId);
    actor.spell(game.i18n.localize('CHAT.rollPanicTable.for.title') + ' ' + actor.name);
}

/**
 * Clean up obsolete macros
 */
async function cleanupMacros() {
    const allItems = FLEAUX.equipment.concat(FLEAUX.talents);
    allItems.push(...FLEAUX.spells);
    
    await game.macros.forEach(async (macro) => {
        const itemType = macro.name.split('.')[0]?.toLowerCase();
        const itemId = macro.name.split('.')[1];
        const itemInActor = game.actors.get(macro.actorId);
        
        if (itemType && (
            itemType === game.fleaux.itemType.talent ||
            itemType === game.fleaux.itemType.spell ||
            itemType === game.fleaux.itemType.state ||
            itemType === game.fleaux.itemType.equipment
        )) {
            const itemInCompendium = allItems.find(item => item.id === itemId)?.id;
            
            if (itemInCompendium == null || itemInCompendium == undefined) {
                const itemInActor = itemInActor?.items?.get(itemId);
                
                if (itemInActor == null || itemInActor == undefined) {
                    const globalItem = game?.items?.get(itemId);
                    
                    if (globalItem == null || globalItem == undefined) {
                        macro.delete();
                    }
                }
            }
        }
    });
}

/**
 * String sanitizer - remove accents from French text
 */
String.prototype.removeAccents = function() {
    var patterns = [
        /[\300-\306]/g, /[\340-\346]/g,  // A, a
        /[\310-\313]/g, /[\350-\353]/g,  // E, e
        /[\314-\317]/g, /[\354-\357]/g,  // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g,      /[\361]/g,       // N, n
        /[\307]/g,      /[\347]/g        // C, c
    ];
    
    var replacements = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];
    
    var result = this;
    for (var i = 0; i < patterns.length; i++) {
        result = result.replace(patterns[i], replacements[i]);
    }
    return result;
};

