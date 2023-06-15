# Guide de développement LP4 

```text
Le projet est séparé en 3 parties : 
- Serveur central
- Serveur de jeu
- Application mobile
```

Nous allons donc expliquer partie par partie le développement de notre jeu, et nous allons commencé par le serveur central !

## Serveur central


Dans le dossier ``/assets``, on peut retrouver l'interface web de notre serveur central. Elle est développée en ReactJs. Nous allons commencé à parler de l'interface web.

### Interface web

Nous n'utilisons pas react router : Pour toute nouvelle route, il faut import votre composant dans le fichier ``app.jsx``. Dans vos composants, vous mettez ```
renderOnDomLoaded(<[nom de votre composant] />, "[nom de votre route]"); ``` fonction codé dans ```/assets/Utils/renderOnDomLoaded.js```.

Nous retrouvons dans le dossier ``/route`` toutes les vues de notre application :
- ``Index.jsx`` : notre page d'accueil qui permet à l'utilisateur de se connecter ou de créer un compte. Rien de particulier à dire sur cette page, vous pouvez changer le message si vous le souhaitez ou simplement rajouter des composants. 
- ``Login.jsx`` : L'utilisateur peut se connecter ou créer un compte. Ces deux pages sont gérés sur le même composant React, en utilisant un changement d'état. 
- ``Dashboard.jsx`` : C'est une page ou l'on peut voir ses configurations, créer une partie avec une configuration chargée ou bien créer une configuration.

- ``Carte.jsx`` : On peut créer une configuration. On utilise la librairie **``Leaflet``**. 

- ``User.jsx`` : Ecran qui affiche les stats du joueur et des parties, qui montre les infos de l'utilisateur et qui permet de se déconnecter.

### Côté serveur

Le serveur est développé en Symfony.
On retrouve dans le dossier ``/Controllers`` les routes des vues ainsi que tous les controllers pour les models. C'est une architecture classique d'un projet Symfony.


## Serveur de jeu

Comme pour le serveur central, nous avons la même manière de procéder.

### Interface web

Il s'agit de l'interface web déstinée au maitre de jeu. Elle se décompose en deux parties :

- ``ChoiceTeam.jsx`` : Page de choix des équipes. On voit les équipes dans le salon de pré-partie, ainsi que les joueurs connectés, ayant une équipe ou non.
On peut lancer la partie depuis cet écran.

- ``Game.jsx`` : Page de monitoring de la partie en cours. On y voit la carte ainsi que les zones, les objets, les méchants ainsi que les joueurs de chaque équipe. La partie se fini à la fin du compteur.

Ces pages sont en discussion avec le conteneur du serveur Mercure ainsi que le conteneur du serveur de jeu.

**Pensez à changer l'URL des fetch si jamais vous choisissez une solution propre à vous.**

### Côté serveur 

C'est le même comportement que le serveur central, la même architecture et la même manière de fonctionner.

## Application mobile

On utilise la librairie Redux pour sauvegarder les informations du serveur sur lequel se connecte l'utilisateur. La simple modification de ces informations entraîne un changement de vue et la connexion/déconnexion au serveur. Cela permet également à l'utilisateur de fermer l'application et de quand même retrouver sa partie en cours lors de la reconnexion.


Toute l'application est décomposé en plusieurs dossiers : 
- ``/Pages``
- ``/Routes``
- ``/Services``
- ``/Constantes``
- ``/Components``


# Conclusion

Vous avez eu une description des différentes parties de notre application, vous pouvez à présent reprendre le projet afin de continuer l'aventure ScoobyHunt, fan de Scooby !