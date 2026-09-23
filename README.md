# OpenSky Radar

## Description

OpenSky Radar est une application web développée dans le cadre de notre projet de cours de TypeScript et React.
Elle permet de suivre en temps réel les aéronefs qui survolent l'Europe (en particulier la France et les pays voisins) grâce aux données fournies par l'API publique d'OpenSky Network.

L'utilisateur peut consulter la liste des vols détectés, rechercher un vol par son immatriculation ou ses coordonnées GPS, filtrer par pays d'origine, trier selon la vitesse ou l'altitude, et consulter une fiche détaillée pour chaque aéronef. L'application intègre également un basculement complet entre un mode clair et un mode sombre.

### Fonctionnement technique et architecture

- Le proxy Vite pour contourner le CORS :
L'API publique d'OpenSky bloque normalement les requêtes directes envoyées depuis un navigateur à cause des règles de sécurité CORS. Pour régler ce problème simplement, nous avons configuré un proxy local dans le fichier vite.config.ts. Lorsque l'application appelle l'adresse `/api/opensky`, c'est le serveur Vite qui effectue la requête vers OpenSky Network et renvoie les données à l'application sans aucun blocage.

- La séparation de la logique métier dans des hooks :
Le composant visuel ne s'occupe pas directement des requêtes ni du tri. Nous avons séparé les responsabilités :
1. Le hook useOpenSkyFlights gère l'appel réseau avec fetch, le statut de chargement, les erreurs et le formatage des données brutes en objets lisibles (vitesse en km/h, altitude en mètres). Il utilise aussi un AbortController pour couper la requête si l'utilisateur change de page pendant le chargement.
2. Le hook useFlightFilters prend la liste des vols et applique les filtres en direct à chaque saisie de l'utilisateur (par plaque, pays ou coordonnées) ainsi que les tris.

- La gestion globale du thème avec React Context :
Le thème clair ou sombre est partagé dans toute l'application via AppContext et géré avec useReducer. Lorsqu'on clique sur le bouton de changement de thème, un attribut data-theme="dark" est appliqué sur la page et le style CSS s'adapte instantanément grâce aux variables CSS.

- Le routage :
Le routage est géré avec react-router-dom v6 dans le composant RoutesFile. Un Layout persistant permet de conserver la barre de navigation sur toutes les pages, avec une page d'accueil, la page radar, une page de détail dynamique pour chaque avion (/flight/:icao), une page à propos et une page d'erreur 404.

- Le typage strict TypeScript :
Le projet est configuré en mode strict et n'utilise aucun type any. Toutes les structures de données (avions, états du thème, paramètres de tri, retours d'API) sont modélisées par des interfaces et des types précis.

---

## Technologies utilisées

- React 19 : bibliothèque principale pour la construction de l'interface utilisateur en composants.
- TypeScript : langage utilisé en mode strict pour garantir la fiabilité et le typage du code.
- Vite : outil de build rapide et serveur de développement local avec gestion du proxy d'API.
- React Router DOM v6 : gestion de la navigation entre les pages sans rechargement.
- Lucide React : bibliothèque d'icônes vectorielles légères.
- Vitest et React Testing Library : environnement d'exécution et écriture des tests automatisés.
- Oxlint : linter de code rapide pour vérifier la qualité du code TypeScript et React.
- CSS Vanilla : styles personnalisés avec variables CSS pour le thème clair et sombre, sans framework lourd.

---

## Fonctionnalités

- Suivi des vols en direct : affichage des avions actuellement détectés au-dessus de la zone géographique sélectionnée.
- Recherche multi-critères : recherche en direct par immatriculation (plaque ou callsign) et par coordonnées de position (latitude / longitude).
- Filtre par pays : menu déroulant généré automatiquement à partir des pays des vols actuellement détectés.
- Tris personnalisés : tri prioritaire par vitesse (du plus lent au plus rapide, ou inversement) et par altitude, avec tri par défaut par ordre alphabétique des pays.
- Validation des saisies : contrôle des champs de recherche avec des expressions régulières pour bloquer les caractères invalides et afficher un message d'erreur clair.
- Mode sombre et mode clair : basculement instantané du thème visuel sur l'ensemble des pages.
- Navigation complète : page d'accueil avec radar animé, page de suivi, page de détail d'un avion avec son identifiant ICAO, page à propos et page 404 personnalisée en cas de mauvaise adresse.
- Gestion propre du réseau : affichage des états d'attente et des messages d'erreur, avec annulation automatique des requêtes non terminées.

---

## Arborescence détaillée du projet

```
Projet-final-react/
│
├── Configuration et racine
│   ├── .gitignore
│   ├── .oxlintrc.json
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── start_project.bat
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── vitest.config.ts
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
└── src/
    ├── main.tsx
    ├── RoutesFile.tsx
    ├── App.tsx
    ├── index.css
    ├── App.css
    │
    ├── assets/
    │   └── vite.svg
    │
    ├── components/
    │   ├── NavBar.tsx
    │   ├── Panel.tsx
    │   └── StatusMessage.tsx
    │
    ├── context/
    │   ├── AppContextDefinition.ts
    │   ├── AppContext.tsx
    │   └── useAppContext.ts
    │
    ├── hooks/
    │   ├── useOpenSkyFlights.ts
    │   └── useFlightFilters.ts
    │
    ├── pages/
    │   ├── FlyRadar.tsx
    │   ├── FlightDetails.tsx
    │   ├── About.tsx
    │   └── NotFound.tsx
    │
    └── test/
        ├── setup.ts
        ├── App.test.tsx
        └── useFlightFilters.test.ts
```

### Rôle de chaque fichier à la racine

- .gitignore : indique à Git les fichiers et dossiers à ignorer pour ne pas alourdir le dépôt (node_modules, dossier dist, caches locaux).
- .oxlintrc.json : configuration du linter Oxlint qui vérifie la conformité du code et les règles des hooks React.
- index.html : fichier HTML de base de l'application qui contient la balise div d'identifiant root dans laquelle React se charge.
- package.json : liste les bibliothèques installées, les dépendances de développement et les commandes de scripts du projet.
- package-lock.json : enregistre les versions exactes des paquets installés pour garantir un environnement identique à toute l'équipe.
- start_project.bat : script pour Windows permettant de tout installer et de lancer le projet automatiquement en un clic.
- tsconfig.json : fichier principal de configuration TypeScript qui coordonne la configuration client et la configuration des outils.
- tsconfig.app.json : configuration stricte du compilateur TypeScript pour le code situé dans le dossier src.
- tsconfig.node.json : configuration TypeScript dédiée aux fichiers d'outils Node comme vite.config.ts et vitest.config.ts.
- vite.config.ts : fichier de réglage de Vite, contenant le plugin React et la déclaration du proxy vers l'API OpenSky.
- vitest.config.ts : configuration de l'environnement de test Vitest avec jsdom.
- README.md : documentation complète du projet.

### Le dossier public/

- public/favicon.svg : petite icône d'avion affichée dans l'onglet du navigateur web.
- public/icons.svg : regroupement d'icônes SVG au format vectoriel.

### Le dossier src/

- src/main.tsx : point d'entrée de React qui initialise l'application dans le DOM, active le StrictMode et démarre BrowserRouter.
- src/RoutesFile.tsx : déclare toutes les routes du site, englobe les pages dans le provider de thème et configure le Layout avec la barre de navigation.
- src/App.tsx : page d'accueil présentant le projet avec une animation de radar en CSS et des cartes explicatives.
- src/index.css : styles de base pour réinitialiser les marges et adapter l'affichage aux écrans mobiles.
- src/App.css : feuille de style principale contenant les variables du mode sombre et clair, le style du tableau des vols et les animations.
- src/assets/vite.svg : logo vectoriel de Vite conservé dans les ressources.

### Le dossier src/components/ (Composants réutilisables)

- src/components/NavBar.tsx : barre de navigation supérieure avec les liens vers l'accueil et vers le radar des vols.
- src/components/Panel.tsx : composant conteneur réutilisable pour afficher du contenu avec une bordure et un fond homogène.
- src/components/StatusMessage.tsx : composant permettant d'afficher un message d'information ou un message d'erreur rouge selon la variante.

### Le dossier src/context/ (Gestion du thème)

- src/context/AppContextDefinition.ts : définit les types TypeScript du thème (light ou dark) et crée l'instance du contexte React.
- src/context/AppContext.tsx : composant AppProvider qui contient le useReducer pour faire basculer le thème et synchroniser la balise html.
- src/context/useAppContext.ts : hook personnalisé qui simplifie l'accès au thème depuis n'importe quel composant.

### Le dossier src/hooks/ (Logique métier et requêtes)

- src/hooks/useOpenSkyFlights.ts : s'occupe de faire la requête vers l'API via le proxy, gère le chargement, les erreurs et convertit les données reçues.
- src/hooks/useFlightFilters.ts : s'occupe de la logique de filtrage (par texte ou par pays) et des tris (vitesse et altitude), avec la fonction utilitaire formatPosition.

### Le dossier src/pages/ (Pages de l'application)

- src/pages/FlyRadar.tsx : page principale avec la liste des avions, le formulaire de filtres, les messages d'état et le bouton de thème.
- src/pages/FlightDetails.tsx : page affichant le détail d'un avion sélectionné à partir de son identifiant dans l'URL.
- src/pages/About.tsx : page explicative sur l'origine des données et le fonctionnement du radar.
- src/pages/NotFound.tsx : page 404 affichée si une route inconnue est demandée, avec un bouton pour revenir à l'accueil.

### Le dossier src/test/ (Tests automatisés)

- src/test/setup.ts : charge les utilitaires jest-dom pour faciliter les assertions sur les éléments HTML dans les tests.
- src/test/App.test.tsx : tests d'intégration vérifiant le lien de l'accueil, les variantes du composant StatusMessage et la validation du formulaire de filtres.
- src/test/useFlightFilters.test.ts : test unitaire vérifiant que le hook de filtrage filtre bien les données selon le pays sélectionné.

---

## Installation et lancement

### Prérequis
Avoir installé Node.js sur son ordinateur (la version la plus récente possible est recommandée).

### Étape 1 : Cloner le projet
Ouvrez un terminal et clonez le dépôt avec la commande suivante :

```bash
git clone https://github.com/Lucasv9230/Projet-final-react.git
cd Projet-final-react
```

### Étape 2 : Lancer le projet

#### Méthode rapide avec le fichier .bat (Windows)
À la racine du dossier cloné, faites simplement un double-clic sur le fichier `start_project.bat`.
Ce script s'occupe de tout automatiquement :
- Il vérifie si le dossier node_modules existe. S'il n'existe pas, il lance automatiquement la commande `npm install`.
- Il démarre le serveur de développement Vite dans une fenêtre de commande.
- Il attend quelques secondes que le serveur soit prêt puis ouvre directement votre navigateur sur `http://localhost:5173`.

#### Méthode manuelle en ligne de commande
Si vous préférez lancer le projet à la main depuis votre terminal :

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer le serveur de développement :
```bash
npm run dev
```

3. Ouvrir votre navigateur web à l'adresse indiquée par Vite (généralement `http://localhost:5173`).

### Les commandes disponibles

- `npm run dev` : démarre le serveur de développement local avec le rechargement automatique à chaque modification.
- `npm run typecheck` : vérifie que tous les types TypeScript sont valides sans compiler de fichiers.
- `npm run lint` : lance la vérification du code avec Oxlint.
- `npm test` : lance les tests automatisés avec Vitest.
- `npm run build` : compile le projet pour la production dans le dossier dist.
- `npm run preview` : permet de prévisualiser localement le projet compilé.

---

## Auteurs et qui a fait quoi

Le projet a été réalisé en groupe de 4 étudiants. Nous nous sommes partagé les tâches selon 4 grands domaines de compétences :

- Naël Morellon :
Mise en place de l'environnement de travail avec Vite, React et TypeScript. Configuration du proxy de développement dans vite.config.ts pour éviter les erreurs CORS avec l'API OpenSky Network. Mise en place de la suite de tests automatisés (Vitest et React Testing Library), réglage du compilateur TypeScript en mode strict dans tsconfig.app.json et intégration de la page d'erreur 404.

- Lucas Vauclin :
Architecture de la navigation et du routage avec React Router v6 (fichier RoutesFile.tsx). Création de la barre de navigation NavBar, intégration de la page d'accueil, premier branchement entre l'API OpenSky et la page FlyRadar, et création du script automatisé start_project.bat pour Windows.

- Anguelo Carathanasis :
Conception des composants graphiques réutilisables (Panel et StatusMessage). Développement de toute la logique métier des filtres et des tris multi-critères dans le hook useFlightFilters, gestion de la validation des formulaires et correction des bugs fonctionnels.

- Romain Tholle :
Design global de l'application et rédaction intégrale de la feuille de style App.css. Mise en place du mode sombre et du mode clair avec React Context et useReducer, animations du radar (ondes et balayage visuel), harmonisation des badges et des tableaux, et rédaction de la documentation du projet.
