# ecoReleveMobile

## Prérequis:
Avoir un accès au serveur ecorelevé (https://github.com/NaturalSolutions/ecoReleve-BE)<br/>
Le principe consiste à créer un projet sur le serveur et le charger sur le mobile (métadonnées et emprise )

## Etapes d'installation 

1- cloner le dépot

2- à la racine du dossier :<br/> 
<i>npm install</i>

3- Créer le fichier config.js selon le modèle https://github.com/NaturalSolutions/ecoReleveMobile/blob/master/src/config.js.default (au même dossier)

3- Pour lancer le serveur : <br/> 
<i>ionic serve</i>

4- pour déployer l'application sur mobile :<br/>
<i>ionic cordova run android</i>


## Utilisation: 

* Charger le projet parmi la liste de projets disponibles sur le serveur (emprise, métadonnées, mise en cache de tuiles carto)

* Sélectionner le projet en cours pour démarrer une saisie

* Consultation / nouvelle observation

* Choix d'un protocole de saisie

* Nouvelle saisie
