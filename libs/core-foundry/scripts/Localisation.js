//#region imports
import system from "../../../system.json" assert { type: "json" };
const Res = await import("../../" + system.id + "/scripts/Ressources.mjs")
	.then(obj => obj.Ressources)
	.catch(err => err.message)
//#endregion
/**
 * @class Localisation
 * @classdesc Intègre le système de localisation du core-rpg dans la classe foundry.Localization
 * @extends foundry.Localization
 */
export class Localisation extends Localization {
	//#region propriétés
	#res = new Res().ressources;
	//#endregion

	//#region méthodes
	/**
	 * @method initialiser
	 * @description Initialise les nouvelles valeurs de langue et de module. Est à appeller dans le hook ready.
	 * @example déclaration de l'objet 		-> Game.i18n = new Localisation();
	 * 			Initialisation de la config	-> Game.i18n.initialiser(Configuration);
	 */
	initialiser(configuration = null) {
		this.lang = game?.i18n.lang;
		this.defaultModule = game?.i18n.defaultModule;
		this.configuration = configuration;
		this.configuration.Langue = game?.i18n.lang
		Handlebars.registerHelper('localiser', function (stringId) { return Game?.i18n.localize(stringId, null, Game?.i18n.lang); });			
	}
	/**
	 * @override
	 * @example Localizing a simple string in JavaScript
	 * ```js
	 * {"MYMODULE.MYSTRING": "Hello, this is my module!"}
	 * game.i18n.localize("MYMODULE.MYSTRING"); // Hello, this is my module!
	 * ```
	 * @example Localizing a simple string in Handlebars
	 * ```hbs
	 * {{localize "MYMODULE.MYSTRING"}} <!-- Hello, this is my module! -->
	 * ```
	*/
	localize(stringId, bind) {
		try { return Res.localiser(this.#res[stringId], bind, this.lang); }
		catch (error) {
			console.log(stringId + ' : ' + error.message)
			return super.localize(stringId);
		}
	}
	//#endregion
}