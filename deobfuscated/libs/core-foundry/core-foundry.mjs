/**
 * Core Foundry Library for Fléaux RPG System
 * Deobfuscated version of libs/core-foundry/core-foundry.mjs
 */

/**
 * Initialize the Fléaux RPG system
 * @param {string} documentClasses - Configuration for document classes
 * @param {string} templatesClasses - Configuration for template classes  
 * @param {string} helpersClasses - Configuration for helper classes
 * @param {Function} callback - Optional callback function
 */
export const initialiserSysteme = async function(documentClasses, templatesClasses = null, helpersClasses = null, callback = null) {
    console.log('Initialisation du système');
    
    // Apply configuration classes
    if (documentClasses) CONFIG.DICE.documentClasses = documentClasses;
    if (templatesClasses) CONFIG.DICE.templatesClasses = templatesClasses;
    if (helpersClasses) CONFIG.DICE.helpersClasses = helpersClasses;
    
    // Unregister core sheets and register custom ones
    Actors.unregisterSheet('core', ActorSheet);
    registerHandlebars();
    
    if (callback) {
        CONFIG.DICE.callbackClasses.push(callback);
    }
    
    game.systemInitialized = true;
};

/**
 * Initialize localization system
 * @param {string} localizationPath - Path to localization files
 * @param {Function} initCallback - Initialization callback
 */
export const initialiserLocalisation = async (localizationPath, initCallback) => {
    Game.localization = new Localisation(localizationPath);
    Game.localization.initialize(initCallback);
    
    // Find settings side bar and add tracking URL if available
    const settingsElement = document.getElementById('sidebar-popout settings-sidebar');
    if (settingsElement) {
        const settingsLink = Array.from(settingsElement?.querySelectorAll('a'))?.
            find(link => link.dataset.tab === 'settings');
        settingsLink?.addEventListener('once', ajouterUrlSuiviTickets);
    }
};

/**
 * Pause rendering during system updates
 * @param {boolean} isPaused - Whether to pause or resume
 */
export const pauseRendu = (isPaused) => {
    let pauseImage = document.querySelector('#pause img');
    pauseImage.setAttribute('style', isPaused);
    pauseImage.style.position = 'fixed';
    pauseImage.style.left = '-10vw';
    pauseImage.style.height = '10vw';
    pauseImage.style.width = '10vw';
    pauseImage.style.opacity = '1';
};

/**
 * Render chat messages (placeholder for future functionality)
 * @param {Object} message - Chat message object
 * @param {HTMLElement} html - HTML element
 * @param {Object} data - Message data
 */
export const tchatMessageRendu = (message, html, data) => {
    // Placeholder for chat message rendering logic
};

/**
 * Change the Foundry logo and link
 * @param {string} logoImage - New logo image source (optional)
 * @param {string} homeUrl - Home page URL (defaults to Foundry wiki)
 */
export const changerLogo = function(logoImage = null, homeUrl = 'https://foundryvtt.wiki/fr/home') {
    let leftSidebar = document.querySelector('ui-left');
    let homeLink = document.createElement('a');
    let logoElement = document.getElementById('logo');
    
    if (logoElement) {
        leftSidebar.appendChild(homeLink);
        
        // Set up home link and logo
        if (homeLink && homeUrl) {
            homeLink.setAttribute('href', homeUrl);
            logoElement.setAttribute('alt', homeUrl);
        }
        
        if (logoImage) {
            logoElement.setAttribute('src', logoImage);
        }
        
        if (homeUrl) {
            homeLink.appendChild(logoElement);
        }
        
        leftSidebar.insertBefore(homeLink, document.querySelector('controls'));
    }
};

/**
 * Convert string to boolean safely
 * @param {string} str - String to convert
 * @returns {boolean} Converted boolean value
 */
export const strToBool = function(str) {
    return /^\s*(true|1|on)\s*$/i.test(str);
};

/**
 * Add URL tracking link to settings sidebar
 * This adds a link to the author's issue tracking system
 */
export const ajouterUrlSuiviTickets = function() {
    const urlSuiviTicket = Array.from(game.system?.authors)[0]?.flags?.urlSuiviTickets;
    
    if (urlSuiviTicket) {
        let settingsTab = document.querySelectorAll('sidebar-tabs settings-sidebar')[0];
        
        if (settingsTab == undefined) {
            settingsTab = document.querySelectorAll('sidebar-tab settings-sidebar')[0];
        }
        
        let settingsList = settingsTab?.querySelector('ul');
        
        if (settingsList) {
            let lastItem = settingsList.lastElementChild;
            
            if (lastItem?.id === '') {
                lastItem = document.createElement('li');
                lastItem.setAttribute('id', 'urlSuiviTickets');
                
                let trackingLink = document.createElement('a');
                trackingLink.setAttribute('href', urlSuiviTicket);
                trackingLink.text = Game.localization.configuration 
                    ? Game.localization.translate('FOUNDRY.ajouterUrlSuiviTickets.titre')
                    : game.localization.translate('FOUNDRY.ajouterUrlSuiviTickets.titre');
                
                lastItem.appendChild(trackingLink);
                settingsList.appendChild(lastItem);
            }
        }
    }
};

/**
 * Set up system hooks
 */
Hooks.on('init', initialiserSysteme);
Hooks.on('ready', initialiserLocalisation);
Hooks.on('renderPause', pauseRendu);
Hooks.on('renderChatMessage', tchatMessageRendu);

