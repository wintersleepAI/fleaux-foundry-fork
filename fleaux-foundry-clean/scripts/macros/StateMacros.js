/**
 * StateMacros - Macro system for state management
 * Deobfuscated and translated version of scripts/macros/StateMacros.js
 */

import MacroScript from '../../libs/core-foundry/modules/components/MacroScript.mjs';

export default class StateMacros {
    /*
     * Static macro codes for effects states
     */
    
    // Handicapped state code
    static HANDICAPPED_CODE = `actor.system.biteTheDustEffects.handicapped=active;
    actor?.toggleStatusEffect('degen', {active: active, overlay: false});
    actor.update({system: actor.system});`;
    
    // Bruised state code
    static BRUISED_CODE = `actor.system.biteTheDustEffects.bruised=active;
    actor?.toggleStatusEffect('downgrade', {active: active, overlay: false});
    actor.update({system: actor.system});`;
    
    // Dead state code
    static DEATH_CODE = `actor.system.biteTheDustEffects.dead=active;
    actor?.toggleStatusEffect('dead', {active: active, overlay: false});
    actor.update({system: actor.system});`;
    
    // Fear state code
    static SCREAM_CODE = `actor?.toggleStatusEffect('fear', {active: active, overlay: false});`;
    
    // Silence state code
    static SILENCED_CODE = `actor.system.sorcery.chaosRevengeEffects.silenced=active;
    actor?.toggleStatusEffect('silence', {active: active, overlay: false});
    actor.update({system: actor.system});`;
    
    // Spirit Consumed state code
    static CONSUMED_SPIRIT_CODE = `actor.system.sorcery.chaosRevengeEffects.consumedSpirit=active;
    //-actor.system.attributes.cool.current = Number(actor.system.attributes.cool.current) + ((active: active, overlay: false)});
    actor.update({system: actor.system});`;
    
    // Other Dimension state code
    static OTHER_DIMENSION_CODE = `actor.system.sorcery.chaosRevengeEffects.otherDimension=active;
    actor.update({system: actor.system});`;
    
    // Arrogance state code
    static ARROGANCE_CODE = `actor.system.sorcery.chaosRevengeEffects.arrogance=active;
    //actor.system.attributes.hp.value = Number(actor.system.attributes.hp.value) + ((active) ? -1 : 1);
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
                FLEAUX.stateDurationType.perSession
            )
        ]).then(item => {
            new MacroScript(item[0], true).creer(
                MacroScript.CODE.replace(MacroScript.CODE, StateMacros.HANDICAPE_CODE), 
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
                FLEAUX.stateDurationType.perSession
            )
        ]).then(item => {
            new MacroScript(item[0], true).creer(
                MacroScript.CODE.replace(MacroScript.CODE, StateMacros.BLESSE_CODE), 
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
                FLEAUX.stateDurationType.perTurn
            )
        ]).then(item => {
            this.acteur.toggleStatusEffect(item[0]);
            new MacroScript(item[0], true, false, false).creer(
                MacroScript.CODE.replace(MacroScript.SCRIPT, StateMacros.BLESSE_CODE), 
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
                FLEAUX.stateDurationType.perDay
            )
        ]).then(item => {
            this.acteur.toggleStatusEffect(killPlayer);
            new MacroScript(item[0], true, false, false).creer(
                MacroScript.CODE.replace(MacroScript.SCRIPT, StateMacros.MORT_CODE), 
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
                FLEAUX.stateDurationType.perTurn
            )
        ]).then(item => {
            new MacroScript(item[0], true).creer(
                MacroScript.CODE.replace(MacroScript.CODE, StateMacros.HURLE_CODE), 
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
                MacroScript.CODE.replace(MacroScript.SCRIPT, StateMacros.HURLE_CODE), 
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
                FLEAUX.stateDurationType.perDay
            )
        ]).then(item => {
            new MacroScript(item[0], true).creer(
                MacroScript.CODE.replace(MacroScript.CODE, StateMacros.REDUITAUSILENCE_CODE), 
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
                FLEAUX.stateDurationType.perDay
            )
        ]).then(item => {
            new MacroScript(item[0], true, false, false).creer(
                MacroScript.CODE.replace(MacroScript.SCRIPT, StateMacros.ARROGANCE_CODE), 
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
                FLEAUX.stateDurationType.perDay
            )
        ]).then(item => {
            new MacroScript(item[0], true, false, false).creer(
                MacroScript.CODE.replace(MacroScript.SCRIPT, StateMacros.ESPRITCONSUME_CODE), 
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
                FLEAUX.stateDurationType.perDay
            )
        ]).then(item => {
            new MacroScript(item[0], true, false, false).creer(
                MacroScript.CODE.replace(MacroScript.CODE, StateMacros.AUTREDIMENSION_CODE), 
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
                FLEAUX.stateDurationType.perDay
            )
        ]).then(item => {
            new MacroScript(item[0], true, false, false).creer(
                MacroScript.CODE.replace(MacroScript.SCRIPT, StateMacros.HURLE_CODE), 
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
            type: game.fleaux.itemType.state,
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
