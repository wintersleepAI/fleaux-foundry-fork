# Fléaux!

Adaptation du jeux de rôle **Fléaux!** sur **Foundry VTT**.
> *Le monde de FLÉAUX! est au bord du précipice. Loin des lumières vacillantes de la civilisation, tapies dans les forêts les plus profondes, cachées dans les ruines des empires passés ; rassemblées derrière les montagnes du bout du monde, les légions du Chaos attendent...*
>
> - Un jeu de rôle écrit par **Kobayashi**
> - Art direction  **EDgarra Studio**
> - Corrections : **Matthieu Chalaux**

*Les règles de Fléaux! sont sous [licence creative commons 4.0](https://creativecommons.org/licenses/by/4.0/)*

## **L'adaptation des règles...**
<details><summary>Dans Foundry VTT</summary>

![Fléaux!](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/raw/distrib/images/ui/couverture-recto.png)

## **Les Caractéristiques**
- Feuille de personnage pour les PJ, PNJ et créatures. Création rapide de personnages.
- Compendiums du livre des règles de base :
	- les peuples,
	- les crimes,
	- les professions,
	- les talents,
	- les sorts,
	- l'équipement.
- Macro de script disponible dans les fiches de talent, sort et équipement. Rend disponible pour les développeurs, la possibilité de coder des améliorations, des automatisations (ex: faire une potion de force +1).
- Enchaînement du lancer de dé d'attribut et de dégâts sur cible sélectionnée et attribution automatique des dégâts sur la cible.
- Automatisation des actions ou des états après un lancer de dé de Volonté faisant appel aux tables **Panique** et **Mordre la poussière** en cas d'échec.
- Automatisation du lancer de sort faisant appel à la table **Revanche du Chaos** en cas d'échec.

## **Les Langues**
- Français
- Anglais

## **Avant de jouer** 
Pour pouvoir profiter du système dans les meilleures conditions : 
- mettre en place une grille sur vos scènes, cela permet de calculer automatiquement les distances pour certaines actions,
- autoriser les macros scriptées aux joueurs (voir Configuration des droits),
- la création du personnage doit être faite par le joueur (voir Configuration des droits 'Créer de nouveaux acteurs').

---
> **Important** : Le système fonctionne seulement sur les navigateurs **Chrome** et **Edge**. Les tests sur **Firefox** ne sont pas concluant.
---

## **La Communauté**
Veuillez rejoindre le serveur Discord FR [La Fonderie->Système Fléaux](https://ptb.discord.com/channels/715943353409339425/948653141811933204).

## **Aperçu en image**
![Fléaux! FoundryVTT](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/raw/distrib/images/ui/fleaux-apercu.png)

</details>

## **Publications**
<details><summary>Versions</summary>

* **à venir**
	>	* Mettre en place le système de progression avec la gestion de l'expérience.
	>	* Mettre en place les armes à feu et les Runes
	>	* Mettre en place le système d'alchimie.

* **2024.1.1**
	>	* L'option de chargement des données est supprimée, elle se fait automatiquement quand on est le GameMaster.
	>	* Mise en place des sockets.
	>	* Compléter la saisie du compendium des sorts.
	>	* Mettre en place le compendium du bestiaire.
	>	* Localisation 'fr' et 'en' complète.
	>	* Amélioration du design.
	>	* Ajout du niveau de menace sur une créature ou un pnj ciblé.
	>	* Maintenance corrective.

* **2023.5.1**
	>	* Passage Foundry v10 -> v11
	> 	* Correction des distances adjacentes

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

<details><summary>Modules Foundry</summary>

* [**socketlib 1.0.13**](https://github.com/manuelVo/foundryvtt-socketlib)

</details>

<details><summary>Librairies</summary>

* **core-foundry 2024.1.1** 

</details>