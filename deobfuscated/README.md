# Fléaux RPG System - Deobfuscated Code

This directory contains the **deobfuscated and decompiled** versions of the Fléaux RPG system for Foundry VTT. The original JavaScript files were heavily obfuscated using variable name mangling, string array encoding, and control flow obfuscation techniques.

## 🎯 What Was Deobfuscated

### Core Files Deobfuscated:
- ✅ **`fleaux.js`** - Main system initialization and module loading
- ✅ **`config.js`** - System constants and enumerations  
- ✅ **`FleauxDes.js`** - Dice rolling system with custom roll logic
- ✅ **`scripts/helpers.js`** - Handlebars template helpers
- ✅ **`libs/core-foundry/core-foundry.mjs`** - Core library functions

### Original Obfuscation Techniques Found:
1. **Variable Name Mangling**: `_0x40081c`, `_0x2b27`, etc.
2. **String Array Encoding**: Hard-coded arrays mapped to offsets
3. **Control Flow Obfuscation**: Complex nested conditions
4. **Dead Code Injection**: Irrelevant functions to confuse analysis
5. **Self-Modifying Functions**: Dynamic code generation

## 📁 File Structure

```
deobfuscated/
├── README.md                          # This documentation
├── fleaux.js                         # Main system file (deobfuscated)
├── config.js                         # Configuration and constants
├── FleauxDes.js                      # Dice rolling system
├── scripts/
│   └── helpers.js                    # Handlebars helpers
└── libs/core-foundry/
    └── core-foundry.mjs              # Core library functions
```

## 🔍 Key Components Deobfuscated

### 1. Dice Rolling System (`FleauxDes.js`)
- **Class Purpose**: Custom dice rolling system extending Foundry's Roll class
- **Key Features**:
  - Advantage/disadvantage mechanics
  - Different roll types (attributes, damage, willpower, usage)
  - Critical hit detection
  - Chat integration with roll results
  - Dialog system for roll options

### 2. Configuration (`config.js`)
- **FLEAUX Object**: Contains all system constants
- **Enumeration Objects**:
  - `typeLancerDesEnum`: Roll type definitions
  - `typeDes`: Advantage/disadvantage states (-1, 0, 1)
  - `typeAttaque`: Attack types (melee, ranged, both)
  - `distance`: Combat distance ranges
  - `typeDureeEtat`: Duration types for status effects

### 3. Main System (`fleaux.js`)
- **System Initialization**: Sets up all sheet classes and paths
- **Compendium Management**: Automated content loading and configuration
- **Socket Functions**: Server-side functions for Game Master interactions
- **Macro Cleanup**: Automatic removal of obsolete macros
- **Utility Functions**: String processing and URL management

### 4. Template Helpers (`scripts/helpers.js`)
- **Handlebars Helpers**: 20+ custom template functions
- **Display Logic**: Formatting for attributes, professions, dice styles
- **Conditional Rendering**: Smart UI display based on game state
- **Localization Support**: Multi-language text rendering

## 🛠️ Technical Details

### Original Obfuscation Patterns:

```javascript
// ❌ BEFORE (Obfuscated)
const _0x40081c=_0x2b27;function _0x2b27(_0xff94f7,_0x4fab7a){...}
this[_0x403ad7(0x1fd)]={'titreTchat':'','succes':![],'critique':![],...}

// ✅ AFTER (Deobfuscated)  
this.fleaux = {
    titreTchat: '',
    succes: false,
    critique: false,
    // ...
}
```

### System Architecture:
1. **Modular Design**: Separate files for different game mechanics
2. **Event-Driven**: Uses Foundry's Hooks system extensively
3. **Compendium Integration**: Automated content loading from JSON files
4. **Socket Communication**: Real-time multiplayer functionality
5. **Template Engine**: Handlebars for dynamic HTML generation

## 🎮 RPG System Features

### Core Mechanics:
- **Dice System**: Custom roll resolution with advantage/disadvantage
- **Character Sheets**: Separate sheets for characters, NPCs, and creatures  
- **Item Types**: Attributes, races, professions, crimes, equipment, talents, spells, states
- **Combat System**: Distance-based positioning and attack types
- **Status Effects**: Persistent conditions with duration tracking

### Language Support:
- **Primary**: French (`fr.json`)
- **Secondary**: English (`en.json`)
- **Utilities**: Accent removal for text processing

## ⚠️ Important Notes

### Legal Considerations:
- **License**: Check `LICENSE.txt` for usage rights
- **Author**: Jhenriot alias lemeran81 (GitLab: jhen-javascript)
- **Original Source**: Try contacting the author for clean source code
- **Purpose**: This deobfuscation is for **educational/understanding purposes only**

### Usage Recommendations:
1. **Study the Code**: Understand the RPG system mechanics
2. **Create Patches**: Use hooks to modify behavior without altering core files
3. **Build Modules**: Create complementary modules using the deobfuscated APIs
4. **Learn Patterns**: Study Foundry VTT module development techniques

## 🚀 Next Steps

To get started with the deobfuscated code:

1. **Study the Main Files**: Start with `fleaux.js` and `config.js`
2. **Understand the Dice System**: Examine `FleauxDes.js` for roll mechanics  
3. **Explore Templates**: Look at the Handlebars helper functions
4. **Review Data Structures**: Check the JSON files in `_jsons/` folder
5. **Test Modifications**: Create patches using Foundry's hook system

## 📚 Additional Resources

- **Foundry VTT Documentation**: https://foundryvtt.wiki/
- **Original Project**: https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux
- **SocketLib Module**: Required dependency for multiplayer features
- **Template Files**: Check the `templates/` folder for Handlebars templates

---

**Disclaimer**: This deobfuscation is for educational purposes. Always respect software licenses and author rights.

