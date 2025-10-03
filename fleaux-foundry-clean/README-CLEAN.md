# Fleaux Foundry VTT - Clean English Version

This is a **deobfuscated, cleaned, and fully translated** version of the Fleaux Foundry VTT module, created from the original obfuscated French codebase.

## 🎯 What's Different

### ✅ **Deobfuscated Code**
- All JavaScript files have been deobfuscated and made human-readable
- Variable names restored to meaningful identifiers
- String arrays decoded and replaced with actual strings
- Control flow obfuscation removed
- Dead code eliminated

### 🌍 **Fully Translated**
- **All code comments** translated from French to English
- **All variable and function names** translated to English
- **All user-facing strings** translated to English
- **All documentation** translated to English
- **README files** translated to English

### 📁 **File Structure**
```
fleaux-foundry-clean/
├── fleaux.js                    # Main module entry (deobfuscated & translated)
├── scripts/                     # All JavaScript files (deobfuscated & translated)
│   ├── actors/                  # Actor sheet classes
│   ├── combat/                  # Combat system
│   ├── items/                   # Item sheet classes
│   ├── macros/                  # Macro system
│   └── *.js                     # Core utilities
├── templates/                   # Handlebars templates
├── styles/                      # CSS stylesheets
├── libs/                        # Core-foundry library
├── assets/                      # Game assets
├── images/                      # Image files
├── sounds/                      # Audio files
├── fonts/                       # Font files
├── lang/                        # Localization files
├── packs/                       # Compendium packs
├── _jsons/                      # JSON data files
├── system.json                  # Module configuration
├── template.json                # Template configuration
├── README.md                    # Translated documentation
└── README-CLEAN.md              # This file
```

## 🚀 **Benefits**

1. **Readable Code**: All JavaScript is now human-readable and maintainable
2. **English Language**: Everything is in English for international developers
3. **Easy Debugging**: Clear variable names and structure make debugging simple
4. **Modification Ready**: Code can be easily modified and extended
5. **Learning Resource**: Perfect for understanding Foundry VTT module development
6. **Clean Architecture**: Well-organized file structure

## 🔧 **Core Components**

### **Actor System**
- `FleauxActor.js` - Base actor class with core functionality
- `CharacterSheet.js` - Player character sheet management
- `CreatureSheet.js` - Creature/monster sheet management

### **Item System**
- `FleauxItem.js` - Base item class
- `ItemSheetAbstract.js` - Abstract item sheet base
- `EquipmentSheet.js` - Equipment management
- `StateSheet.js` - Status effect management
- `PeopleSheet.js` - Cultural background management
- `ProfessionSheet.js` - Career management
- `CrimeSheet.js` - Accusation system

### **Combat System**
- `FleauxCombat.js` - Custom combat mechanics with Cool initiative

### **Utilities**
- `FleauxDice.js` - Dice rolling system
- `StateMacros.js` - Status effect macros
- `chat.js` - Chat integration
- `templates.js` - Template preloader
- `settings.js` - Module settings
- `helpers.js` - Utility functions
- `config.js` - Configuration management

## 📋 **Installation**

1. Copy this folder to your Foundry VTT `Data/modules/` directory
2. Rename the folder to `fleaux` (or your preferred module name)
3. Update `system.json` if needed for your Foundry VTT version
4. Enable the module in Foundry VTT

## 🛠️ **Development**

This clean English version is perfect for:
- **Learning**: Understanding Foundry VTT module architecture
- **Modification**: Adding new features or customizing behavior
- **Debugging**: Easily identifying and fixing issues
- **Extension**: Building upon the existing functionality
- **International Development**: Working in English language environment

## 📝 **Translation Notes**

- All French comments have been translated to English
- Variable names follow English conventions (e.g., `PersonnageSheet` → `CharacterSheet`)
- Function names are in English (e.g., `affichageTchatSuccesEchec` → `displayChatSuccessFailure`)
- String literals and user-facing text translated to English
- Documentation completely translated to English

## 🎮 **Original Module**

This is based on the Fleaux RPG system for Foundry VTT. The original obfuscated French version can be found in the parent directory.

---

**Created**: $(date)  
**Source**: Deobfuscated and translated from fleaux-foundry-fork  
**Status**: Ready for use, modification, and international development