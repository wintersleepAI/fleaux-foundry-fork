# Fleaux Foundry VTT - Clean Version

This is a **deobfuscated and cleaned version** of the Fleaux Foundry VTT module, created from the original obfuscated codebase.

## 🎯 What's Different

### ✅ **Deobfuscated Code**
- All JavaScript files have been deobfuscated and made human-readable
- Variable names restored to meaningful identifiers
- String arrays decoded and replaced with actual strings
- Control flow obfuscation removed
- Dead code eliminated

### 📁 **File Structure**
```
fleaux-foundry-clean/
├── fleaux.js                    # Main module entry (deobfuscated)
├── scripts/                     # All JavaScript files (deobfuscated)
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
└── README.md                    # Original documentation
```

## 🚀 **Benefits**

1. **Readable Code**: All JavaScript is now human-readable and maintainable
2. **Easy Debugging**: Clear variable names and structure make debugging simple
3. **Modification Ready**: Code can be easily modified and extended
4. **Learning Resource**: Perfect for understanding Foundry VTT module development
5. **Clean Architecture**: Well-organized file structure

## 🔧 **Core Components**

### **Actor System**
- `FleauxActeur.js` - Base actor class with core functionality
- `PersonnageSheet.js` - Player character sheet management
- `CreatureSheet.js` - Creature/monster sheet management

### **Item System**
- `FleauxItem.js` - Base item class
- `ItemSheetAbstract.js` - Abstract item sheet base
- `EquipementSheet.js` - Equipment management
- `EtatSheet.js` - Status effect management
- `PeupleSheet.js` - Cultural background management
- `ProfessionSheet.js` - Career management
- `CrimeSheet.js` - Accusation system

### **Combat System**
- `FleauxCombat.js` - Custom combat mechanics with Sang-froid initiative

### **Utilities**
- `FleauxDes.js` - Dice rolling system
- `MacrosEtats.js` - Status effect macros
- `tchat.js` - Chat integration
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

This clean version is perfect for:
- **Learning**: Understanding Foundry VTT module architecture
- **Modification**: Adding new features or customizing behavior
- **Debugging**: Easily identifying and fixing issues
- **Extension**: Building upon the existing functionality

## 📝 **Notes**

- All original functionality has been preserved
- The code structure follows Foundry VTT best practices
- Comments have been added to explain complex logic
- Variable names are descriptive and follow JavaScript conventions

## 🎮 **Original Module**

This is based on the Fleaux RPG system for Foundry VTT. The original obfuscated version can be found in the parent directory.

---

**Created**: $(date)  
**Source**: Deobfuscated from fleaux-foundry-fork  
**Status**: Ready for use and modification
