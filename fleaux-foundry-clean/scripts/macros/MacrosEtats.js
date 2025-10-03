/**
 * MacrosEtats - Macro system for state management
 * Deobfuscated version of scripts/macros/MacrosEtats.js
 */

import MacroScript from '../../libs/core-foundry/modules/components/MacroScript.mjs';

export default class MacrosEtats {
    /*
     * Static macro codes for effects states
     */
    
    // Handicapped state code
    static HANDICAPE_CODE = `actor.system.effetsMordreLaPoussiere.handicape=active;
    actor?.toggleStatusEffect('degen', {active: active, overlay: false});
    actor.update({system: actor.system});`;
    
    // Bruised state code
    static AMOCHE_CODE = `actor.system.effetsMordreLaPoussiere.amoche=active;
    actor?.toggleStatusEffect('downgrade', {active: active, overlay: false});
    actor.update({system: actor.system});`;
    
    // Dead state code
    static MORT_CODE = `actor.system.effetsMordreLaPoussiere.mort=active;
    actor?.toggleStatusEffect('dead', {active: active, overlay: false});
    actor.update({system: actor.system});`;
    
    // Fear state code
    static HURLE_CODE = `actor?.toggleStatusEffect('fear', {active: active, overlay: false});`;
    
    // Silence state code
    static REDUITAUSILENCE_CODE = `actor.system.sorcellerie.effetsRevancheDuChaos.reduitAuSilence=active;
    actor?.toggleStatusEffect('silence', {active: active, overlay: false});
    actor.update({system: actor.system});`;
    
    // Spirit Consumed state code
    static ESPRITCONSUME_CODE = `actor.system.sorcellerie.effetsRevancheDuChaos.espritConsume=active;
    //-actor.system.attributs.sfr.actuel = Number(actor.system.attributs.sfr.actuel) + ((active: active, overlay: false)});
    actor.update({system: actor.system});`;
    
    // Other Dimension state code
    static AUTREDIMENSION_CODE = `actor.system.sorcellerie.effetsRevancheDuChaos.autreDimension=active;
    actor.update({system: actor.system});`;
    
    // Arrogance state code
    static ARROGANCE_CODE = `actor.system.sorcellerie.effetsRevancheDuChaos.arrongance=active;
    //actor.system.attributes.pv.value = Number(actor.system.attributes.pv.value) + ((active) ? -1 : 1);
    actor.update({system: actor.system});`;

    /**
     * Constructor
     */
    constructor(actor) {
        this.acteur = actor;
    }

    /**
     * Apply handicapped state effect
     */
    async getHandicape() {
        const tableLocalization = game.i18n.localize('TABLE.mordrelapoussiere.2');
        
        return await this.acteur.createEmbeddedDocuments('Item', [
            this.getItemEtat(
                tableLocalization.split(': ')[0], 
                'icons/svg/degen.svg', 
                tableLocalization.split(': ')[1], 
                FLEAUX.typeDureeEtat.eParPartie
            )
        ]).then(item => {
            new MacroScript(item[0], true).creer(
                MacroScript.CODE.replace(MacroScript.CODE, MacrosEtats.HANDICAPE_CODE), 
                true
            );
        });
    }

    /**
     * Apply bruised state effect
     */
    async getAmoche() {
        const tableLocalization = game.i18n.localize('MACROETATS.Amoche.nom');
        
        return await this.acteur.createEmbeddedDocuments('Item', [
            this.getItemEtat(
                tableLocalization.split(': ')[0], 
                'icons/svg/downgrade.svg', 
                tableLocalization.split(': ')[1], 
                FLEAUX.typeDureeEtat.eParPartie
            )
        ]).then(item => {
            new MacroScript(item[0], true).creer(
                MacroScript.CODE.replace(MacroScript.CODE, MacrosEtats.BLESSE_CODE), 
                true
            );
        });
    }

    /**
     * Apply bleeding state effect
     */
    async getBlesse() {
        const tableLocalization = game.i18n.localize('MACROETATS.Blesse.nom');
        
        return await this.acteur.createEmbeddedDocuments('Item', [
            this.getItemEtat(
                tableLocalization.split(': ')[0], 
                'icons/svg/blood.svg', 
                tableLocalization.split(': ')[1].replace('{nom}', game.i18n.localize('MACROETATS.personnage.nom')), 
                FLEAUX.typeDureeEtat.eParTour
            )
        ]).then(item => {
            this.acteur.toggleStatusEffect(item[0]);
            new MacroScript(item[0], true, false, false).creer(
                MacroScript.CODE.replace(MacroScript.SCRIPT, MacrosEtats.BLESSE_CODE), 
                true
            );
        });
    }

    /**
     * Apply death state effect
     */
    async getMort(killPlayer = true) {
        const tableLocalization = game.i18n.localize('MACROETATS.Mort.nom');
        
        return await this.acteur.createEmbeddedDocuments('Item', [
            this.getItemEtat(
                tableLocalization.split(': ')[0], 
                'icons/svg/skull.svg', 
                tableLocalization.split(': ')[1].replace('{nom}', game.i18n.localize('MACROETATS.personnage.nom')), 
                FLEAUX.typeDureeEtat.eParJournee
            )
        ]).then(item => {
            this.acteur.toggleStatusEffect(killPlayer);
            new MacroScript(item[0], true, false, false).creer(
                MacroScript.CODE.replace(MacroScript.SCRIPT, MacrosEtats.MORT_CODE), 
                true
            );
        });
    }

    /**
     * Apply fear state effect
     */
    async getHurle() {
        const tableLocalization = game.i18n.localize('MACROETATS.Hurle.nom');
        
        return await this.acteur.createEmbeddedDocuments('Item', [
            this.getItemEtat(
                game.i18n.localize('MACROETATS.Fuir.nom'), 
                'icons/svg/pawprint.svg', 
                tableLocalization, 
                FLEAUX.typeDureeEtat.eParTour
            )
        ]).then(item => {
            new MacroScript(item[0], true).creer(
                MacroScript.CODE.replace(MacroScript.CODE, MacrosEtats.HURLE_CODE), 
                true
            );
        });
    }

    /**
     * Apply panic state effect
     */
    async getFuir() {
        const tableLocalization = game.i18n.localize('TABLE.panique.2');
        
        return await this.acteur.createEmbeddedDocuments('Item', [
            this.getItemEtat(
                game.i18n.localize('MACROETATS.Fuir.nom'), 
                'icons/svg/terror.svg', 
                game.i18n.format('NOTIFICATION.effrayer.warn', {
                    'nom': game.i18n.localize('MACROETATS.personnage.nom').toLowerCase()
                }), 
                FLEAUX.typeDureeEtat.ePermanent
            )
        ]).then(item => {
            new MacroScript(item[0], true).creer(
                MacroScript.CODE.replace(MacroScript.SCRIPT, MacrosEtats.HURLE_CODE), 
                true
            );
        });
    }

    /**
     * Apply spirit consumed state effect
     */
    async getEspritConsume() {
        const tableLocalization = game.i18n.localize('TABLE.revancheduchaos.1');
        
        return await this.acteur.createEmbeddedDocuments('Item', [
            this.getItemEtat(
                game.i18n.localize('MACROETATS.EspritConsume.nom'), 
                'icons/svg/silhouteted.svg', 
                tableLocalization, 
                FLEAUX.typeDureeEtat.eParJournee
            )
        ]).then(item => {
            new MacroScript(item[0], true).creer(
                MacroScript.CODE.replace(MacroScript.CODE, MacrosEtats.REDUITAUSILENCE_CODE), 
                true
            );
        });
    }

    /**
     * Apply arrogance state effect
     */
    async getArrogance() {
        const tableLocalization = game.i18n.localize('TABLE.revancheduchaos.4');
        
        return await this.acteur.createEmbeddedDocuments('Item', [
            this.getItemEtat(
                game.i18n.localize('MACROETATS.Arrogance.nom'), 
                'icons/svg/terror.svg', 
                tableLocalization, 
                FLEAUX.typeDureeEtat.eParJournee
            )
        ]).then(item => {
            new MacroScript(item[0], true, false, false).creer(
                MacroScript.CODE.replace(MacroScript.SCRIPT, MacrosEtats.ARROGANCE_CODE), 
                true
            );
        });
    }

    /**
     * Apply reduced to silence state effect
     */
    async getReduitAuSilence() {
        const tableLocalization = game.i18n.localize('MACROETATS.ReduitAuSilence.nom');
        
        return await this.acteur.createEmbeddedDocuments('Item', [
            this.getItemEtat(
                game.i18n.localize('MACROETATS.ReduitAuSilence.nom'), 
                'icons/svg/silence.svg', 
                tableLocalization, 
                FLEAUX.typeDureeEtat.eParJournee
            )
        ]).then(item => {
            new MacroScript(item[0], true, false, false).creer(
                MacroScript.CODE.replace(MacroScript.SCRIPT, MacrosEtats.ESPRITCONSUME_CODE), 
                true
            );
        });
    }

    /**
     * Apply other dimension state effect
     */
    async getAutreDimension() {
        const tableLocalization = game.i18n.localize('MACROETATS.AutreDimension.nom');
        
        return await this.acteur.createEmbeddedDocuments('Item', [
            this.getItemEtat(
                game.i18n.localize('MACROETATS.AutreDimension.nom'), 
                'icons/svg/blinded.svg', 
                tableLocalization, 
                FLEAUX.typeDureeEtat.eParJournee
            )
        ]).then(item => {
            new MacroScript(item[0], true, false, false).creer(
                MacroScript.CODE.replace(MacroScript.CODE, MacrosEtats.AUTREDIMENSION_CODE), 
                true
            );
        });
    }

    /**
     * Apply hysterical blindness state effect
     */
    async getCeciteHysterique() {
        const tableLocalization = game.i18n.localize('MACROETATS.CeciteHysterique.nom');
        
        return await this.acteur.createEmbeddedDocuments('Item', [
            this.getItemEtat(
                game.i18n.localize('MACROETATS.CeciteHysterique.nom'), 
                'icons/svg/blind.svg', 
                tableLocalization, 
                FLEAUX.typeDureeEtat.eParJournee
            )
        ]).then(item => {
            new MacroScript(item[0], true, false, false).creer(
                MacroScript.CODE.replace(MacroScript.SCRIPT, MacrosEtats.HURLE_CODE), 
                true
            );
        });
    }

    /**
     * Generate state item data
     */
    getItemEtat(name, icon, description, durationType = FLEAUX.typeDureeEtat.ePermanent) {
        let currentDate = new Date(Date.now());
        
        return {
            name: name,
            type: game.fleaux.typeItem.etat,
            img: icon,
            system: {
                description: description,
                date: currentDate.toLocaleDateString() + ' ' + currentDate.toLocaleTimeString(),
                idActeur: this.acteur.id,
                typeDuree: durationType,
                duree: null
            }
        };
    }

    /**
     * Get the actor reference
     */
    get acteur() {
        return this.acteur;
    }
}
