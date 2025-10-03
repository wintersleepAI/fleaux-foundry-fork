/**
 * Main Fléaux RPG System Module for Foundry VTT
 * Deobfuscated version of the original fleaux.js
 */

// Import core functionality
import { 
    changerLogo, 
    ajouterUrlSuiviTickets, 
    Compendium as CompendiumManager 
} from './libs/core-foundry/core-foundry.mjs';

// Import game classes
import { FleauxDes } from './scripts/FleauxDes.js';
import { FleauxActeur } from './scripts/actors/FleauxActeur.js';
import { FleauxCombat } from './scripts/combat/FleauxCombat.js';

// Import character sheets
import { PersonnageSheet } from './scripts/actors/PersonnageSheet.js';
import { CreatureSheet } from './scripts/actors/CreatureSheet.js';

// Import item sheets
import { CrimeSheet } from './scripts/items/CrimeSheet.js';
import { EquipementSheet } from './scripts/items/EquipementSheet.js';
import { EtatSheet } from './scripts/items/EtatSheet.js';
import { FleauxItem } from './scripts/items/FleauxItem.js';
import { ItemSheetAbstract } from './scripts/items/ItemSheetAbstract.js';
import { PeupleSheet } from './scripts/items/PeupleSheet.js';
import { ProfessionSheet } from './scripts/items/ProfessionSheet.js';

// Import utility modules
import * as tchatModule from './scripts/tchat.js';
import { registerHandlebarsHelpers } from './scripts/helpers.js';
import { preloadHandlebarsTemplates } from './scripts/templates.js';

let socket = null;

/**
 * Initialize the system when socketlib is ready
 */
Hooks.once('socketlib.ready', async function() {
    console.log('Initialisation de fleaux en cours.');
    
    // Set logo and home URL
    changerLogo(null, 'https://foundryvtt.wiki/fr/home');
    
    // Configure game paths and settings
    game.fleaux = {
        jsonsPath: 'systems/' + game.system.id + '/_jsons/',
        templatesPath: 'systems/' + game.system.id + '/templates/',
        templatesActorsPath: 'systems/' + game.system.id + '/templates/actors/',
        templatesItemsPath: 'systems/' + game.system.id + '/templates/items/',
        templatesDialoguesChemin: 'systems/' + game.system.id + '/templates/dialogues/',
        templatesTchatsChemin: 'systems/' + game.system.id + '/templates/tchats/',
        imagesPath: 'systems/' + game.system.id + '/images/',
        
        // Actor types
        typeActor: {
            character: 'character',
            pnj: 'pnj',
            creature: 'creature'
        },
        
        // Item types
        typeItem: {
            attribut: 'attribut',
            peuple: 'peuple',
            crime: 'crime',
            profession: 'profession',
            talent: 'talent',
            sort: 'sort',
            equipement: 'equipement',
            etat: 'etat'
        },
        
        config: FLEAUX,
        itemClasses: ['fleaux', 'item', 'talent'],
        acteurClasses: ['fleaux', 'item', 'pnj', 'character'],
        des: FleauxDes,
        socket: socket,
        TCHAT_TEMPLATE: {
            TOOLTIP_TEMPLATE: 'systems/fleaux/templates/tchats/infobulle.hbs',
            TCHAT_TEMPLATE: 'systems/fleaux/templates/tchats/lancer-des-dialogue.html'
        }
    };

    // Set system title
    game.system.title = 'SYSTEM.label';
    
    // Configure core systems
    CONFIG.Combat.documentClass = FleauxCombat;
    CONFIG.Actor.documentClass = FleauxActeur;
    CONFIG.Item.documentClass = FleauxItem;
    CONFIG.Macro.documentClass = 'systems/fleaux/images/ui/macro-script.webp';
    
    // Configure compendium banners
    CONFIG.Scene.compendiumBanner = 'systems/fleaux/images/ui/compendiums.png';
    CONFIG.RollTable.compendiumBanner = 'systems/fleaux/images/ui/compendiums.png';
    CONFIG.JournalEntry.compendiumBanner = 'systems/fleaux/images/ui/compendiums.png';
    
    // Register dice configuration
    CONFIG.Dice.rolls.push(game.fleaux.des);
    
    // Register actor sheets
    let fleauxSystem = game.fleaux;
    Actors.unregisterSheet('core', ActorSheet);
    
    // Character sheet
    Actors.registerSheet('fleaux', PersonnageSheet, {
        types: [fleauxSystem.typeActor.character],
        makeDefault: true,
        label: 'TYPES.Actor.character'
    });
    
    // NPC sheet
    Actors.registerSheet('fleaux', PersonnageSheet, {
        types: [fleauxSystem.typeActor.pnj],
        makeDefault: true,
        label: 'TYPES.Actor.pnj'
    });
    
    // Creature sheet
    Actors.registerSheet('fleaux', CreatureSheet, {
        types: [fleauxSystem.typeActor.creature],
        makeDefault: true,
        label: 'TYPES.Actor.creature'
    });
    
    // Register item sheets
    Items.unregisterSheet('core', ItemSheet);
    
    Items.registerSheet('fleaux', ItemSheetAbstract, {
        types: [fleauxSystem.typeItem.attribut],
        makeDefault: true,
        label: 'TYPES.Item.attribut'
    });
    
    Items.registerSheet('fleaux', PeupleSheet, {
        types: [fleauxSystem.typeItem.peuple],
        makeDefault: true,
        label: 'TYPES.Item.peuple'
    });
    
    Items.registerSheet('fleaux', CrimeSheet, {
        types: [fleauxSystem.typeItem.crime],
        makeDefault: true,
        label: 'TYPES.Item.crime'
    });
    
    Items.registerSheet('fleaux', ProfessionSheet, {
        types: [fleauxSystem.typeItem.profession],
        makeDefault: true,
        label: 'TYPES.Item.profession'
    });
    
    Items.registerSheet('fleaux', ItemSheetAbstract, {
        types: [fleauxSystem.typeItem.talent],
        makeDefault: true,
        label: 'TYPES.Item.talent'
    });
    
    Items.registerSheet('fleaux', ItemSheetAbstract, {
        types: [fleauxSystem.typeItem.sort],
        makeDefault: true,
        label: 'TYPES.Item.sort'
    });
    
    Items.registerSheet('fleaux', EquipementSheet, {
        types: [fleauxSystem.typeItem.equipement],
        makeDefault: true,
        label: 'TYPES.Item.equipement'
    });
    
    Items.registerSheet('fleaux', EtatSheet, {
        types: [fleauxSystem.typeItem.etat],
        makeDefault: true,
        label: 'TYPES.Item.etat'
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
    ajouterUrlSuiviTickets();
    
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
        await CompendiumManager.import(systemData.packs[0].name, game.fleaux.jsonsPath, game.i18n.localize('BESTIAIRE.minuscule.nom'));
        await CompendiumManager.import(systemData.packs[1].name, game.fleaux.jsonsPath, game.i18n.localize('ATTRIBUTS.minuscule.nom'));
        await CompendiumManager.import(systemData.packs[2].name, game.fleaux.jsonsPath, game.i18n.localize('PEUPLES.minuscule.nom'));
        await CompendiumManager.import(systemData.packs[3].name, game.fleaux.jsonsPath, game.i18n.localize('CRIMES.minuscule.nom'));
        await CompendiumManager.import(systemData.packs[4].name, game.fleaux.jsonsPath, game.i18n.localize('PROFESSIONS.minuscule.nom'));
        await CompendiumManager.import(systemData.packs[5].name, game.fleaux.jsonsPath, game.i18n.localize('EQUIPEMENTS.minuscule.nom'));
        await CompendiumManager.import(systemData.packs[6].name, game.fleaux.jsonsPath, game.i18n.localize('TALENTS.minuscule.nom'));
        await CompendiumManager.import(systemData.packs[7].name, game.fleaux.jsonsPath, game.i18n.localize('SORTS.minuscule.nom'));
        
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
    FLEAUX.bestiaire = await CompendiumManager.getContent(systemData.packs[0].name);
    FLEAUX.attributs = await CompendiumManager.getContent(systemData.packs[1].name);
    FLEAUX.peuples = await CompendiumManager.getContent(systemData.packs[2].name);
    FLEAUX.crimes = await CompendiumManager.getContent(systemData.packs[3].name);
    FLEAUX.professions = await CompendiumManager.getContent(systemData.packs[4].name);
    FLEAUX.equipements = await CompendiumManager.getContent(systemData.packs[5].name);
    FLEAUX.talents = await CompendiumManager.getContent(systemData.packs[6].name);
    FLEAUX.sorts = await CompendiumManager.getContent(systemData.packs[7].name);
    
    console.log('Initialisation de fleaux terminé.');
    await nettoyerMacros();
    console.log('Nettoyer les macros obsolètes.');
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
    tchatModule.affichageTchatSuccesEchec(message, html, data);
});

/**
 * Socketlib initialization
 */
Hooks.once('socketlib.ready', () => {
    socket = socketlib.register('fleaux');
    
    // Register socket functions
    socket.register('desarmement', desarmement);
    socket.register('affecterDegats', affecterDegats);
    socket.register('hurlementDePanique', hurlementDePanique);
});

/**
 * Socket functions for Game Master interactions
 */

function desarmement(actorId) {
    return game.actors.get(actorId).desarmerEnnemi();
}

function affecterDegats(actorId, tokenIds, damages, isPublic = true) {
    let tokens = [];
    tokenIds.forEach(tokenId => {
        tokens.push((
            game.scenes?.active?.tokens?.find(token => token?.actorId === tokenId)
        )?.object);
    });
    game.actors.get(actorId).affecterDegats(tokens, damages, isPublic);
}

function hurlementDePanique(actorId) {
    const actor = game.actors.get(actorId);
    actor.spell(game.i18n.localize('TCHAT.lancerDesTablePanique.pour.titre') + ' ' + actor.name);
}

/**
 * Clean up obsolete macros
 */
async function nettoyerMacros() {
    const allItems = FLEAUX.equipements.concat(FLEAUX.talents);
    allItems.push(...FLEAUX.sorts);
    
    await game.macros.forEach(async (macro) => {
        const typeItem = macro.name.split('.')[0]?.toLowerCase();
        const itemId = macro.name.split('.')[1];
        const itemDansActeur = game.actors.get(macro.actorId);
        
        if (typeItem && (
            typeItem === game.fleaux.typeItem.talent ||
            typeItem === game.fleaux.typeItem.sort ||
            typeItem === game.fleaux.typeItem.etat ||
            typeItem === game.fleaux.typeItem.equipement
        )) {
            const itemDansCompendium = allItems.find(item => item.id === itemId)?.id;
            
            if (itemDansCompendium == null || itemDansCompendium == undefined) {
                const itemDansActor = itemDansActeur?.items?.get(itemId);
                
                if (itemDansActor == null || itemDansActor == undefined) {
                    const itemGlobal = game?.items?.get(itemId);
                    
                    if (itemGlobal == null || itemGlobal == undefined) {
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
String.prototype.sansAccent = function() {
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

