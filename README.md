# Fléaux!

Adapatation du jeux de rôle **Fléaux!** sur **Foundry VTT**.

---
> **Important** : Le système fonctionne seulement sur les navigateurs **Chrome** et **Edge**. Les tests sur **Firefox** ne sont pas concluant.
---

<details><summary>Versions</summary>

* **à venir**
	>	* Compléter la saisie du compendium des sorts.
	>	* Mettre en place le compendium du bestiaire.
	>	* Mettre en place le système de progression avec la gestion de l'expérience.
	>	* Localisation 'fr', 'en' et maintenance corrective.

* **2023.4.1**
	>	* Mettre en place le système de magie. https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/v10/distributions/fleaux/-/issues/2
	>	* Localisation 'fr', 'en' et maintenance corrective.

* **2023.3.1**
	>	* Implémenter les macros pour les équipements, les talents et les sorts. https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/v10/distributions/fleaux/-/issues/1
	>	* Maintenance corrective :
			>> - [x] https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/v10/distributions/fleaux/-/issues/5
			>> - [x] https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/v10/distributions/fleaux/-/issues/6

* **2023.2.1**
	>	* Finaliser Se Défendre avec la parade ou l'esquive (page 35).
	>	* Le bouclier accorde un avantage au jets de parade.
	>	* Un lancé de Sang Froid permet de choisir entre un lancé normal de sang froid, un lancé de peur ou un lancé d'initiative.
	>	* Ajout de l'objet critique (réussite et échec) sur le personnage. Celà permettra de modifier par macro les valeurs par défaut 1 et 20.
	>	* Remplacement des 'title' par des 'tooltips' dans les html
	>	* Mettre en place la gestion des états comme handicapé et blessé. Utilisation des macros pour la gestion des états.
* **2023.1.1**
	>	* Mettre en place l'initiative. 
	>	* Refactorisation du système de dés conforme foundry v10 -> classe FleauxDes
	>	* Rendre le bouton 'Tout réinitialiser' seulement disponible pour le MJ.
	>	* Compatibilité des images de l'UI pour les systèmes linux.
	>	* Ajout de la scène de bienvenue sur Fléaux !, identique à l'image de fond.
	>	* Localisation 'fr', 'en' et maintenance corrective.
* **2022.5.3**
	>	* Ajout de la notion de bonus/malus lors des jets d'attribut.
	>	* Ajout de la notion de récupération avec repos court et long.
	>	* Design des formulaires 'Item' améliorés.
	>	* Localisation 'fr', 'en' et maintenance corrective.
* **2022.5.2**
	>	* Création du personnage avec alimentation automatique des attributs, de l'argent et de l'équipement de base.
	>	* Ajout automatique d'une armure légère equipée si la profession est violente.
	>	* Compendium des équipements complétés. 
	>	* Nouvelle gestion de l'emplacement (Aucun | Dans une main | Avec les deux mains | Sur le corps). 
	Les équipements de type *'Armures'* sont forcément *'Sur le corps'*, seule une protection permet de rendre cet équipement équipable.
</details>

<details><summary>Libs</summary>

* **core-foundry 2023.1.2** 

</details>