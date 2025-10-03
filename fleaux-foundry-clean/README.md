# Fléaux!

Adaptation of the **Fléaux!** role-playing game for **Foundry VTT**.
> *The world of FLÉAUX! is on the brink of the abyss. Far from the flickering lights of civilization, lurking in the deepest forests, hidden in the ruins of past empires; gathered behind the mountains at the end of the world, the legions of Chaos wait...*
>
> - A role-playing game written by **Kobayashi**
> - Art direction **EDgarra Studio**
> - Corrections: **Matthieu Chalaux**

*The Fléaux! rules are under [Creative Commons 4.0 license](https://creativecommons.org/licenses/by/4.0/)*

## **Rule Adaptation...**
<details><summary>In Foundry VTT</summary>

![Fléaux!](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/raw/distrib/images/ui/couverture-recto.png)

## **Features**
- Character sheet for PCs, NPCs and creatures. Quick character creation.
- Compendiums from the basic rulebook:
	- peoples,
	- crimes,
	- professions,
	- talents,
	- spells,
	- equipment.
- Script macros available in talent, spell and equipment sheets. Provides developers with the ability to code improvements, automations (e.g., making a strength potion +1).
- Chaining of attribute dice rolls and damage on selected target with automatic damage assignment to the target.
- Automation of actions or states after a Willpower dice roll using **Panic** and **Bite the Dust** tables on failure.
- Automation of spell casting using the **Chaos Revenge** table on failure.

## **Languages**
- French
- English

## **Before Playing** 
To enjoy the system under the best conditions:
- set up a grid on your scenes, this allows automatic distance calculation for certain actions,
- allow scripted macros for players (see Rights Configuration),
- character creation must be done by the player (see Rights Configuration 'Create new actors').

---
> **Important**: The system only works on **Chrome** and **Edge** browsers. Tests on **Firefox** are not conclusive.
---

## **Community**
Please join the FR Discord server [La Fonderie->Fléaux System](https://ptb.discord.com/channels/715943353409339425/948653141811933204).

## **Image Preview**
![Fléaux! FoundryVTT](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/raw/distrib/images/ui/fleaux-apercu.png)

</details>

## **Publications**
<details><summary>Versions</summary>

* **Coming Soon**
	> * [ ] Implement firearms and Runes
	> * [ ] Implement the alchemy system.

* **2024.4.2**
	> * [x] [fix 2024.4: spells can no longer be added to the sheet](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/incident/11)

* **2024.4.1**
	> * [x] [Implement the progression system with experience management.](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/8)
	> * [x] Add a 'ticket tracking table [gitlab]' link in Settings/General Information.
	> * [x] Corrective maintenance.

* **2024.3.1**
	> * [x] Integration of core-foundry version 2024.2.1 special Foundry v12.
	> * [x] Foundry v11 -> v12 migration.
	> * [x] Cleanup of obsolete macros.
	> * [x] Verification of weapon type during melee or ranged dice rolls.
	> * [x] Display in the dice roll dialog window of attribute and damage dice rolls of the targeted token or no targeted token.
	> * [x] Corrective maintenance.

* **2024.2.1**
	> * [x] Integration of core-foundry version 2024.1.3.
	> * [x] Corrective maintenance.

* **2024.1.1**
	> * [x] The data loading option is removed, it happens automatically when you are the GameMaster.
	> * [x] Implementation of sockets.
	> * [x] [Complete the spell compendium input.](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/7)
	> * [x] [Implement the bestiary compendium.](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/3)
	> * [x] [Complete 'fr' and 'en' localization.](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/4)
	> * [x] Design improvements.
	> * [x] Addition of threat level on a targeted creature or NPC.
	> * [x] Corrective maintenance.

* **2023.5.1**
	> * [x] Foundry v10 -> v11 migration
	> * [x] Correction of adjacent distances

* **2023.4.1**
	> * [x] [Implement the magic system.](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/2)
	> * [x] 'fr', 'en' localization and corrective maintenance.

* **2023.3.1**
  >>>
  * [x] [Implement macros for equipment, talents and spells.](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/1)
  * [x] Corrective maintenance:  
    * [x] [Avatar image > Deformation](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/5) 
    * [x] [Create an NPC actor](https://gitlab.com/jhen-javascript/rpg-engine/vtt/foundry/distributions/fleaux/-/issues/6)

* **2023.2.1**
	> * [x] Finalize Defend with parry or dodge (page 35).
	> * [x] Shield grants advantage to parry rolls.
	> * [x] A Cool roll allows choosing between a normal cool roll, a fear roll or an initiative roll.
	> * [x] Addition of critical object (success and failure) on the character. This will allow modifying default values 1 and 20 by macro.
	> * [x] Replacement of 'title' with 'tooltips' in html
	> * [x] Implement state management like handicapped and wounded. Use macros for state management.
* **2023.1.1**
	> * [x] Implement initiative. 
	> * [x] Refactoring of the dice system compliant with foundry v10 -> FleauxDice class
	> * [x] Make the 'Reset All' button only available to the GM.
	> * [x] Compatibility of UI images for linux systems.
	> * [x] Addition of the welcome scene on Fléaux!, identical to the background image.
	> * [x] 'fr', 'en' localization and corrective maintenance.
* **2022.5.3**
	> * [x] Addition of bonus/malus notion during attribute rolls.
	> * [x] Addition of recovery notion with short and long rest.
	> * [x] Improved 'Item' form design.
	> * [x] 'fr', 'en' localization and corrective maintenance.
* **2022.5.2**
	> * [x] Character creation with automatic feeding of attributes, money and basic equipment.
	> * [x] Automatic addition of light armor equipped if the profession is violent.
	> * [x] Equipment compendium completed. 
	> * [x] New slot management (None | In one hand | With both hands | On the body). 
	Equipment of type *'Armor'* is necessarily *'On the body'*, only protection allows this equipment to be equipable.
	
</details>

<details><summary>Foundry Modules</summary>

* [**socketlib 1.0.13**](https://github.com/manuelVo/foundryvtt-socketlib)

</details>

<details><summary>Libraries</summary>

* **core-foundry 2024.2.1** 

</details>