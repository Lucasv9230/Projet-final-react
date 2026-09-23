# OpenSky Radar - Suivi des vols en direct

Projet réalisé dans le cadre de notre cours de TypeScript et React.
L'objectif de l'application est de suivre en direct les avions qui survolent l'Europe en utilisant l'API publique d'OpenSky Network. L'utilisateur peut voir la liste des vols, faire des recherches précises, trier selon plusieurs critères et basculer entre un mode clair et un mode sombre.

---

## Notre groupe et la répartition du travail

Nous étions 4 étudiants sur ce projet. Pour travailler efficacement et éviter de nous marcher dessus, nous nous sommes divisé les tâches en 4 parties principales :

- Naël Morellon :
Il s'est chargé de la mise en place du projet avec Vite, React et TypeScript. Il a configuré le proxy dans le fichier vite.config.ts pour que l'on puisse interroger l'API OpenSky sans être bloqué par les sécurités du navigateur (CORS). Il a également mis en place la configuration des tests avec Vitest et React Testing Library, le typage strict dans tsconfig, et le style de la page 404.

- Lucas Vauclin :
Il s'est occupé de toute la partie navigation et routage avec React Router (v6). Il a créé la barre de navigation (NavBar), relié la première version de l'API avec la page radar, développé la page d'accueil et mis en place le script start_project.bat pour que n'importe qui puisse lancer le projet en un double-clic sur Windows.

- Anguelo Carath :
Il a développé les composants réutilisables de l'interface comme Panel et StatusMessage. Il a aussi codé toute la logique des filtres et des tris dans le hook useFlightFilters (filtrage par plaque, par pays, tri par vitesse et altitude), ainsi que la validation des formulaires pour empêcher la saisie de caractères invalides.

- Romain Tholle :
Il a conçu l'ensemble de l'interface graphique et rédigé la feuille de style App.css. Il a mis en place le système de thème (mode sombre et mode clair) avec l'API Context de React et useReducer, créé les animations du radar sur la page d'accueil, ajusté la disposition des tableaux et rédigé ce README.

---

## Comment fonctionne l'application (Architecture)

### La récupération des données et le proxy
Quand l'application se charge, elle doit récupérer la position des avions sur l'API OpenSky Network. En temps normal, faire cette requête directement depuis le navigateur provoque une erreur CORS. Pour régler ce problème simplement, nous utilisons le serveur de développement de Vite comme relais (proxy) :
- Le code React appelle l'adresse locale `/api/opensky`.
- Vite intercepte cet appel et le renvoie vers l'adresse réelle d'OpenSky (`https://opensky-network.org/api/states/all`) avec les coordonnées de la zone que l'on souhaite observer (France et pays voisins).
- Vite nous renvoie ensuite les données sans aucun blocage de sécurité.

### La gestion des données et des filtres
Le traitement des données se fait en deux étapes grâce à deux hooks personnalisés :
1. Le hook `useOpenSkyFlights` s'occupe de faire la requête HTTP. Il gère le temps de chargement, affiche un message en cas d'erreur réseau et convertit les données brutes de l'API (qui arrivent sous forme de tableau complexe) en une liste d'objets propres avec des noms compréhensibles (pays, plaque, altitude, vitesse). On y utilise aussi un `AbortController` pour couper la requête si l'utilisateur change de page avant la fin du téléchargement.
2. Le hook `useFlightFilters` prend cette liste d'avions et s'occupe de tout ce qui est interactif. C'est lui qui recalcule en direct les avions à afficher dès que l'utilisateur tape un mot dans la barre de recherche, choisit un pays dans la liste déroulante ou demande un tri par altitude ou par vitesse.

### La gestion du thème global (Context)
Pour que le bouton de changement de thème soit accessible et que toute la page s'adapte, nous avons créé un contexte React (`AppContext`). L'état est géré avec un `useReducer`. Lorsque l'utilisateur clique sur le bouton pour changer de thème, le reducer met à jour l'état et un effet applique automatiquement l'attribut `data-theme="dark"` sur la balise principale du site. En CSS, nous avons créé des variables de couleurs pour chaque thème, ce qui permet à toute l'interface de basculer instantanément.

### Le routage
Le site utilise `react-router-dom` pour naviguer entre les différentes pages sans jamais recharger le navigateur :
- La page d'accueil (`/`) présente le projet avec un visuel de radar animé.
- La page radar (`/flyradar`) affiche le tableau complet avec les filtres et le bouton de thème.
- La page de détail (`/flight/:icao`) permet de voir les informations d'un avion précis grâce à son identifiant dans l'URL.
- La page à propos (`/about`) donne quelques informations complémentaires sur la source des données.
- La page 404 s'affiche automatiquement si l'utilisateur tape une adresse qui n'existe pas.

### Le typage TypeScript
Tout le projet est écrit en TypeScript avec le mode strict activé. Nous n'avons utilisé aucun `any` :
- Chaque avion respecte l'interface `Flight`.
- Les états possibles pour les tris ou le thème sont verrouillés avec des types stricts (par exemple `'light' | 'dark'`).
- La réponse de l'API OpenSky est typée avec une interface générique pour garantir que les champs manipulés existent bien.

---

## Présentation détaillée de tous les dossiers et fichiers

### Les fichiers à la racine du projet

- `.gitignore` : indique à Git les fichiers et dossiers temporaires à ne pas sauvegarder en ligne, comme le dossier node_modules ou les dossiers de build.
- `.oxlintrc.json` : configure le linter Oxlint, un outil rapide qui vérifie que le code React respecte bien les bonnes pratiques (par exemple les règles d'utilisation des hooks).
- `index.html` : la seule page HTML du projet. Elle sert de squelette, charge notre fichier TypeScript principal et contient la div root dans laquelle React vient injecter l'interface.
- `package.json` : le fichier d'identité du projet. Il liste tous les paquets installés (React, React Router, Lucide, Vitest...) ainsi que les raccourcis de commande comme npm run dev ou npm test.
- `package-lock.json` : enregistre avec précision la version exacte de chaque dépendance installée pour que le projet fonctionne de la même manière sur les ordinateurs des 4 membres de l'équipe.
- `start_project.bat` : un script batch pour Windows. En double-cliquant dessus, il vérifie si les dépendances sont installées (et lance npm install si besoin), démarre le serveur Vite et ouvre directement la page dans le navigateur.
- `tsconfig.json` : le fichier racine de TypeScript qui fait le lien entre la configuration du code client et celle des outils Node.
- `tsconfig.app.json` : la configuration TypeScript stricte pour tout le code source dans src. Il force la détection des erreurs et interdit les variables déclarées qui ne servent à rien.
- `tsconfig.node.json` : la configuration TypeScript pour les fichiers de configuration qui tournent avec Node.js (comme vite.config.ts).
- `vite.config.ts` : la configuration de Vite. Il active le support de React et met en place le proxy qui redirige les appels de `/api/opensky` vers l'API externe OpenSky pour contourner le CORS.
- `vitest.config.ts` : la configuration de l'outil de test Vitest. Il active la simulation du DOM avec jsdom et charge le fichier de configuration des tests.
- `README.md` : ce fichier de documentation qui explique le projet, le travail de l'équipe et le rôle de chaque fichier.

### Le dossier public/

- `public/favicon.svg` : la petite icône d'avion affichée à gauche dans l'onglet du navigateur web.
- `public/icons.svg` : un fichier qui regroupe plusieurs icônes vectorielles pouvant être réutilisées dans le projet.

### Le dossier src/

- `src/main.tsx` : le point d'entrée de notre code React. Il trouve la div root dans le fichier HTML, active le mode de contrôle StrictMode de React et démarre BrowserRouter pour que la navigation fonctionne.
- `src/RoutesFile.tsx` : centralise la déclaration de toutes les routes du site. Il entoure l'application du provider AppProvider pour le thème et utilise un Layout avec la barre de navigation et Outlet pour afficher les différentes pages.
- `src/App.tsx` : le composant de la page d'accueil. Il affiche le titre, le bouton d'accès au radar, trois cartes de fonctionnalités avec des icônes Lucide et une animation de radar réalisée en CSS.
- `src/index.css` : le fichier CSS de base. Il remet à zéro les marges par défaut, applique la police d'écriture et contient les règles pour adapter l'affichage sur téléphone portable.
- `src/App.css` : la feuille de style principale du projet. Elle contient les variables de couleurs pour le mode clair et le mode sombre, le style du tableau des vols, la mise en page des filtres et les animations visuelles.
- `src/assets/vite.svg` : le logo officiel de Vite qui est conservé dans le dossier des images.

### Le dossier src/components/ (Composants réutilisables)

- `src/components/NavBar.tsx` : la barre de navigation présente en haut du site. Elle utilise les composants Link de react-router-dom pour permettre de changer de page sans rechargement.
- `src/components/Panel.tsx` : un composant conteneur qui sert de cadre pour regrouper des éléments avec un fond et une bordure propres. Il prend du contenu via sa prop children.
- `src/components/StatusMessage.tsx` : un petit composant pratique pour afficher des messages à l'utilisateur. Il peut afficher un message d'attente classique ou un message d'erreur rouge selon la variante choisie.

### Le dossier src/context/ (Gestion globale du thème)

- `src/context/AppContextDefinition.ts` : contient les types TypeScript associés au thème (Theme, AppState, AppContextValue) et crée l'objet AppContext avec createContext.
- `src/context/AppContext.tsx` : le composant AppProvider qui contient la logique du thème. Il utilise un useReducer pour passer du clair au sombre et un useEffect pour mettre à jour l'attribut sur la balise html.
- `src/context/useAppContext.ts` : un hook simple qui permet à n'importe quel composant de récupérer le thème et la fonction toggleTheme sans devoir réécrire useContext partout.

### Le dossier src/hooks/ (Logique métier et requêtes)

- `src/hooks/useOpenSkyFlights.ts` : le hook qui contacte l'API OpenSky. Il gère la requête avec fetch, l'annulation avec AbortController si le composant est fermé, et transforme les données brutes en un tableau d'avions avec des valeurs lisibles (vitesse en km/h, altitude arrondie).
- `src/hooks/useFlightFilters.ts` : le hook qui gère les filtres et les tris. Il filtre la liste des avions selon le pays sélectionné, le texte tapé pour la plaque ou les coordonnées, et trie par vitesse ou altitude. Il contient aussi la fonction formatPosition qui affiche proprement la latitude et la longitude.

### Le dossier src/pages/ (Les vues de l'application)

- `src/pages/FlyRadar.tsx` : la page centrale de l'application. Elle rassemble le bouton de changement de thème, les champs de filtres, la gestion des erreurs de saisie, le statut de chargement et le grand tableau avec tous les avions trouvés.
- `src/pages/FlightDetails.tsx` : la page de détail d'un avion. Elle récupère le code de l'avion dans l'URL grâce au hook useParams et propose un bouton pour revenir au radar.
- `src/pages/About.tsx` : une page simple qui explique l'origine du projet et le fait que les données proviennent d'OpenSky Network.
- `src/pages/NotFound.tsx` : la page d'erreur 404 qui s'affiche si l'adresse demandée n'existe pas, avec un visuel de signal perdu et un bouton pour retourner à l'accueil.

### Le dossier src/test/ (Les tests automatisés)

- `src/test/setup.ts` : prépare l'environnement de test enimportant les extensions jest-dom pour Vitest, ce qui permet de tester facilement le contenu du DOM.
- `src/test/App.test.tsx` : contient les tests de nos composants. Il vérifie que le bouton vers le radar est bien présent sur l'accueil, que le composant StatusMessage change bien de style en cas d'erreur, et que le formulaire bloque bien la soumission si on tape une plaque invalide.
- `src/test/useFlightFilters.test.ts` : teste directement le hook useFlightFilters avec renderHook pour s'assurer que le filtrage par pays renvoie bien uniquement les avions demandés.

---

## Comment lancer le projet

### Prérequis
Il faut avoir installé Node.js sur son ordinateur (version 20 ou plus récente recommandée).

### Option 1 : Lancement rapide sur Windows
Il suffit de faire un double-clic sur le fichier `start_project.bat` à la racine du dossier.
Le script s'occupe de tout : il installe les modules nécessaires si ce n'est pas déjà fait, lance le serveur et ouvre automatiquement le site dans votre navigateur.

### Option 2 : Lancement manuel via le terminal
Ouvrez un terminal dans le dossier du projet et tapez :

1. Pour installer les dépendances :
```bash
npm install
```

2. Pour démarrer le serveur local :
```bash
npm run dev
```

Ensuite, ouvrez votre navigateur à l'adresse indiquée (généralement `http://localhost:5173`).

---

## Les commandes utiles

- `npm run dev` : lance le serveur de développement avec le rechargement automatique dès qu'on modifie un fichier.
- `npm run typecheck` : vérifie que tout le code respecte bien les types TypeScript sans compiler de fichiers.
- `npm run lint` : lance l'outil Oxlint pour vérifier la qualité du code et repérer d'éventuelles erreurs.
- `npm test` : lance l'ensemble des tests automatisés avec Vitest.
- `npm run build` : prépare et compile l'application pour la production dans le dossier dist.
- `npm run preview` : permet de prévisualiser localement le résultat du build de production.