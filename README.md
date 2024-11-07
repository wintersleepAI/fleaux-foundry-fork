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
	> * [ ] Mettre en place les armes à feu et les Runes
	> * [ ] Mettre en place le système d'alchimie.

* **2024.4.2**
	> * [x] [fix 2024.4 : les sorts ne peuvent plus être ajouter dans la fiche](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/incident/11)

* **2024.4.1**
	> * [x] [Mettre en place le système de progression avec la gestion de l'expérience.](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/8)
	> * [x] Ajouter un lien 'tableau du suivi des tickets [gitlab]' dans Paramètres/Informations générales.
	> * [x] Maintenance corrective.

* **2024.3.1**
	> * [x] Intégration de la version core-foundry 2024.2.1 spéciale Foundry v12.
	> * [x] Passage Foundry v11 -> v12.
	> * [x] Nettoyage des macros obsolètes.
	> * [x] Vérification du type d'arme lors d'un lancer de dés de mêlée ou de tir.
	> * [x] Affichage dans la fenêtre de dialogue de lancer de dés d'attribut et de dégats du pion ciblé ou aucun pion ciblé.
	> * [x] Maintenance corrective.

* **2024.2.1**
	> * [x] Intégration de la version core-foundry 2024.1.3.
	> * [x] Maintenance corrective.

* **2024.1.1**
	> * [x] L'option de chargement des données est supprimée, elle se fait automatiquement quand on est le GameMaster.
	> * [x] Mise en place des sockets.
	> * [x] [Compléter la saisie du compendium des sorts.](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/7)
	> * [x] [Mettre en place le compendium du bestiaire.](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/3)
	> * [x] [Localisation 'fr' et 'en' complète.](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/4)
	> * [x] Amélioration du design.
	> * [x] Ajout du niveau de menace sur une créature ou un pnj ciblé.
	> * [x] Maintenance corrective.

* **2023.5.1**
	> * [x] Passage Foundry v10 -> v11
	> * [x] Correction des distances adjacentes

* **2023.4.1**
	> * [x] [Mettre en place le système de magie.](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/2)
	> * [x] Localisation 'fr', 'en' et maintenance corrective.

* **2023.3.1**
  >>>
  * [x] [Implémenter les macros pour les équipements, les talents et les sorts.](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/1)
  * [x] Maintenance corrective :  
    * [x] [Image de l'avatar \> Déformation](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/5) 
    * [x] [Créer un actor PNJ](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/6)

* **2023.2.1**
	> * [x] Finaliser Se Défendre avec la parade ou l'esquive (page 35).
	> * [x] Le bouclier accorde un avantage au jets de parade.
	> * [x] Un lancé de Sang Froid permet de choisir entre un lancé normal de sang froid, un lancé de peur ou un lancé d'initiative.
	> * [x] Ajout de l'objet critique (réussite et échec) sur le personnage. Celà permettra de modifier par macro les valeurs par défaut 1 et 20.
	> * [x] Remplacement des 'title' par des 'tooltips' dans les html
	> * [x] Mettre en place la gestion des états comme handicapé et blessé. Utilisation des macros pour la gestion des états.
* **2023.1.1**
	> * [x] Mettre en place l'initiative. 
	> * [x] Refactorisation du système de dés conforme foundry v10 -> classe FleauxDes
	> * [x] Rendre le bouton 'Tout réinitialiser' seulement disponible pour le MJ.
	> * [x] Compatibilité des images de l'UI pour les systèmes linux.
	> * [x] Ajout de la scène de bienvenue sur Fléaux !, identique à l'image de fond.
	> * [x] Localisation 'fr', 'en' et maintenance corrective.
* **2022.5.3**
	> * [x] Ajout de la notion de bonus/malus lors des jets d'attribut.
	> * [x] Ajout de la notion de récupération avec repos court et long.
	> * [x] Design des formulaires 'Item' améliorés.
	> * [x] Localisation 'fr', 'en' et maintenance corrective.
* **2022.5.2**
	> * [x] Création du personnage avec alimentation automatique des attributs, de l'argent et de l'équipement de base.
	> * [x] Ajout automatique d'une armure légère equipée si la profession est violente.
	> * [x] Compendium des équipements complétés. 
	> * [x] Nouvelle gestion de l'emplacement (Aucun | Dans une main | Avec les deux mains | Sur le corps). 
	Les équipements de type *'Armures'* sont forcément *'Sur le corps'*, seule une protection permet de rendre cet équipement équipable.
	
</details>

<details><summary>Modules Foundry</summary>

* [**socketlib 1.0.13**](https://github.com/manuelVo/foundryvtt-socketlib)

</details>

<details><summary>Librairies</summary>

* **core-foundry 2024.2.1** 

</details>