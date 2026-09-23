# OpenSky Radar - Suivi du Trafic Aérien en Direct

Application web réalisée avec React 19, TypeScript (en mode strict) et Vite.
Ce projet permet de visualiser en temps réel les avions qui survolent l'Europe grâce aux données fournies par l'API publique OpenSky Network.

---

## Équipe et répartition du travail

Nous avons réalisé ce projet en groupe de 4 étudiants. Le travail a été réparti équitablement en 4 grands rôles :

- **Naël Morellon** :
  - Initialisation et configuration du projet (Vite, React, TypeScript).
  - Configuration du proxy de développement dans vite.config.ts pour régler les problèmes de CORS avec l'API OpenSky.
  - Mise en place des tests automatisés avec Vitest et React Testing Library.
  - Configuration du compilateur TypeScript en mode strict (tsconfig.app.json).
  - Intégration et style de la page d'erreur 404.

- **Lucas Vauclin** :
  - Mise en place du routage complet avec react-router-dom v6 (RoutesFile.tsx).
  - Développement du composant de navigation (NavBar.tsx).
  - Intégration de la page principale FlyRadar et premier raccordement avec l'API OpenSky.
  - Création de la page d'accueil.
  - Création du script start_project.bat pour lancer automatiquement le projet en un clic.

- **Anguelo Carath** :
  - Création des composants réutilisables (Panel.tsx, StatusMessage.tsx).
  - Développement de la logique des filtres et du tri multi-critères dans le hook useFlightFilters.ts.
  - Gestion de la validation du formulaire de recherche et des messages d'erreur.
  - Correction des bugs sur l'affichage des données.

- **Romain Tholle** :
  - Création complète du design de l'application et de la feuille de style App.css.
  - Mise en place du mode sombre / mode clair avec l'API Context de React et le hook useReducer.
  - Création des animations du radar (balayage, cercles et points lumineux).
  - Harmonisation graphique des tableaux et badges de données.
  - Rédaction et organisation de la documentation du projet.

---

## Architecture et fonctionnement du projet

### Flux des données
1. L'application interroge l'API OpenSky Network via l'URL locale `/api/opensky`.
2. Le serveur de développement Vite intercepte cet appel grâce à son proxy et le redirige vers l'API externe `https://opensky-network.org/api/states/all`. Cela permet d'éviter les blocages liés au CORS.
3. Le hook personnalisé `useOpenSkyFlights` reçoit les données brutes, les filtre sur une zone géographique définie (Europe / France), vérifie leur format et les transforme en objets typés exploitables par React.
4. Le hook `useFlightFilters` prend la liste des vols et applique les filtres demandés par l'utilisateur (par pays, plaque d'immatriculation ou coordonnées) ainsi que les tris (vitesse et altitude).
5. Les composants graphiques (`FlyRadar`, `Panel`, `StatusMessage`) affichent ensuite les résultats sous forme de tableau ou d'alertes.

### Gestion de l'état
- **État global (thème)** : Le thème de l'application (clair ou sombre) est partagé dans toute l'application via `AppContext`. Il est géré avec un `useReducer` pour modifier l'état de façon propre. Un `useEffect` applique l'attribut `data-theme="dark"` sur la balise html pour activer les variables CSS correspondantes.
- **État des requêtes API** : Le hook `useOpenSkyFlights` gère les états de chargement (`loading`), d'erreur (`error`) et de succès (`flights`). Il intègre un `AbortController` pour annuler les requêtes si le composant est démonté avant la fin du téléchargement.
- **État local des filtres** : Le hook `useFlightFilters` conserve les valeurs des champs de recherche (recherche de plaque, coordonnées, pays sélectionné, sens de tri) et recalcule dynamiquement la liste filtrée à chaque modification.

### Routage
Le routage est géré avec `react-router-dom` v6 dans le fichier `RoutesFile.tsx` :
- Un composant de structure `Layout` affiche la barre de navigation sur toutes les pages principales grâce à la balise `<Outlet />`.
- `/` : Page d'accueil de présentation.
- `/flyradar` : Page principale du radar avec la liste des vols et les filtres.
- `/flight/:icao` : Page de détail d'un avion avec son identifiant ICAO passé dans l'URL.
- `/about` : Page d'informations sur le projet.
- `*` : Page 404 en cas d'URL introuvable.

### Typage TypeScript
Le projet respecte les règles strictes de TypeScript. Aucun type `any` n'est utilisé :
- Les données des vols sont typées via l'interface `Flight`.
- Les réponses de l'API utilisent un type générique `OpenSkyApiResponse<T>`.
- Les états possibles sont verrouillés avec des types unions (`Theme = 'light' | 'dark'`, `SortOrder = 'none' | 'ascending' | 'descending'`, `StatusVariant = 'info' | 'error'`).

---

## Structure du projet et rôle de chaque fichier

### Fichiers à la racine

- **.gitignore** : Liste les dossiers et fichiers que Git ne doit pas suivre (le dossier node_modules, les fichiers de build dans dist, les caches locaux).
- **.oxlintrc.json** : Fichier de configuration du linter Oxlint pour vérifier la qualité du code et s'assurer du bon respect des règles de React et TypeScript.
- **index.html** : Page HTML principale de la SPA (Single Page Application). Elle contient la balise div avec l'identifiant root où l'application React s'affiche, et charge le fichier main.tsx.
- **package.json** : Contient la liste des dépendances du projet (React, React Router, Lucide-react, Vitest, TypeScript, etc.) et les scripts de commande.
- **package-lock.json** : Enregistre les versions exactes des dépendances installées pour que tous les membres du groupe aient exactement le même environnement.
- **start_project.bat** : Script Windows pour automatiser le démarrage du projet. Il installe automatiquement les dépendances si le dossier node_modules n'existe pas, démarre le serveur de développement Vite et ouvre la page dans le navigateur web.
- **tsconfig.json** : Fichier principal de configuration de TypeScript qui fait le lien entre la configuration de l'application et celle des outils Node.
- **tsconfig.app.json** : Configuration TypeScript stricte pour le code de l'application situé dans src (activation du mode strict, interdiction des variables inutilisées, ciblage moderne ES2023).
- **tsconfig.node.json** : Configuration TypeScript dédiée aux fichiers d'outils exécutés par Node.js (vite.config.ts et vitest.config.ts).
- **vite.config.ts** : Configuration de Vite. Il active le plugin React et configure le proxy local `/api/opensky` qui redirige les requêtes vers l'API OpenSky Network sans bloquer sur les règles CORS.
- **vitest.config.ts** : Configuration de l'environnement de test Vitest (simulation du DOM avec jsdom et chargement du fichier de configuration des tests).
- **README.md** : Ce fichier de documentation qui présente le projet, l'équipe, l'architecture et l'ensemble des fichiers.

### Dossier public/

- **public/favicon.svg** : Icône vectorielle du projet représentant un avion/radar, affichée dans l'onglet du navigateur.
- **public/icons.svg** : Fichier contenant des symboles SVG regroupés pour l'affichage graphique.

### Dossier src/

- **src/main.tsx** : Point d'entrée du code React. Il récupère l'élément HTML root, active le mode StrictMode de React et démarre le routeur BrowserRouter autour du composant RoutesFile.
- **src/RoutesFile.tsx** : Déclare l'ensemble des routes de l'application avec React Router v6. Il enveloppe les pages dans le provider AppProvider pour le thème et utilise un Layout avec NavBar et Outlet.
- **src/App.tsx** : Page d'accueil de l'application. Elle affiche une présentation du projet avec une animation de radar en CSS, un bouton d'accès rapide vers la page radar et une présentation des fonctionnalités avec des icônes Lucide.
- **src/index.css** : Styles CSS de base pour réinitialiser les marges du navigateur, définir la police générale et gérer les adaptations d'affichage pour mobile.
- **src/App.css** : Feuille de style principale de l'application. Elle contient la définition des couleurs pour le mode clair et le mode sombre, le style du tableau des vols, les filtres de recherche et les animations du radar.
- **src/assets/vite.svg** : Image vectorielle du logo de Vite conservée dans les assets.

### Dossier src/components/ (Composants réutilisables)

- **src/components/NavBar.tsx** : Barre de navigation affichée en haut des pages. Elle propose les liens vers l'accueil et le radar en utilisant le composant Link de react-router-dom pour naviguer sans recharger la page.
- **src/components/Panel.tsx** : Composant de boîte réutilisable pour afficher du contenu avec un conteneur propre et cohérent. Il reçoit son contenu via la prop children typée en ReactNode.
- **src/components/StatusMessage.tsx** : Composant d'affichage de messages d'état pour l'utilisateur. Il propose deux variantes (message d'information classique ou message d'erreur avec fond rouge).

### Dossier src/context/ (Gestion du thème global)

- **src/context/AppContextDefinition.ts** : Définit les types TypeScript du contexte (type Theme valant 'light' ou 'dark', interface de l'état AppState, interface AppContextValue) et instancie l'objet React AppContext.
- **src/context/AppContext.tsx** : Composant AppProvider qui gère l'état du thème à l'aide d'un useReducer. Dès que le thème change, il modifie l'attribut data-theme de la page pour basculer les couleurs CSS.
- **src/context/useAppContext.ts** : Hook personnalisé qui simplifie l'accès au contexte et s'assure qu'il est bien appelé à l'intérieur du composant AppProvider.

### Dossier src/hooks/ (Logique métier et API)

- **src/hooks/useOpenSkyFlights.ts** : Hook qui effectue la requête HTTP vers l'API OpenSky via le proxy `/api/opensky`. Il utilise un AbortController pour annuler la requête lors du démontage du composant et transforme les données brutes reçues en une liste d'aéronefs au format typé Flight (calcul de la vitesse en km/h, arrondi de l'altitude).
- **src/hooks/useFlightFilters.ts** : Hook qui regroupe la logique de filtrage et de tri. Il gère la recherche par nom de plaque, par coordonnées géographiques, par pays, ainsi que le tri par vitesse ou altitude. Il exporte aussi la fonction utilitaire formatPosition pour afficher les coordonnées sous forme lisible.

### Dossier src/pages/ (Pages de l'application)

- **src/pages/FlyRadar.tsx** : Page principale du radar. Elle réunit le bouton de changement de thème, le formulaire de filtres avec validation par expressions régulières, les messages de chargement ou d'erreur, et le tableau complet listant les avions trouvés.
- **src/pages/FlightDetails.tsx** : Page affichant les détails d'un vol particulier. Elle utilise useParams pour récupérer l'identifiant ICAO depuis l'URL `/flight/:icao` et propose un lien de retour vers le radar.
- **src/pages/About.tsx** : Page simple « À propos » qui explique brièvement le but du radar et la provenance des données OpenSky Network.
- **src/pages/NotFound.tsx** : Page d'erreur 404 affichée lorsqu'une URL n'existe pas. Elle présente une animation CSS de signal perdu et un bouton utilisant useNavigate pour revenir à l'accueil.

### Dossier src/test/ (Tests automatisés)

- **src/test/setup.ts** : Fichier de préparation des tests. Il charge les extensions jest-dom pour Vitest afin de pouvoir tester facilement les éléments du DOM (vérifier les classes CSS, les attributs, etc.).
- **src/test/App.test.tsx** : Contient les tests des composants React :
  - Vérifie que le lien vers le radar est bien présent sur la page d'accueil.
  - Vérifie que le composant StatusMessage affiche correctement la classe d'erreur lorsqu'on lui passe la variante error.
  - Vérifie que le formulaire de filtres de la page FlyRadar bloque la soumission et affiche une alerte si une plaque invalide est saisie.
- **src/test/useFlightFilters.test.ts** : Test unitaire du hook de filtrage useFlightFilters à l'aide de renderHook. Il vérifie que le filtrage par pays renvoie bien uniquement les avions du pays sélectionné.

---

## Installation et lancement

### Prérequis
- Avoir installé Node.js (version 20 ou supérieure recommandée).
- Avoir npm installé (fourni automatiquement avec Node.js).

### Méthode 1 : Lancement automatique en un clic (Windows)
À la racine du dossier, double-cliquez sur le fichier `start_project.bat`.
Le script va vérifier les fichiers, installer les dépendances nécessaires avec `npm install`, lancer le serveur Vite et ouvrir automatiquement votre navigateur sur `http://localhost:5173`.

### Méthode 2 : Lancement manuel via le terminal

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer le serveur de développement :
```bash
npm run dev
```

L'application est ensuite accessible dans le navigateur à l'adresse indiquée dans le terminal (par défaut : `http://localhost:5173`).

---

## Commandes disponibles

- `npm run dev` : Lance le serveur de développement avec rechargement à chaud (Vite HMR).
- `npm run typecheck` : Vérifie tous les types TypeScript du projet sans compiler de fichiers JavaScript.
- `npm run lint` : Lance l'analyse de code avec Oxlint pour vérifier les règles de syntaxe et de bonnes pratiques.
- `npm test` : Lance la suite de tests automatisés avec Vitest.
- `npm run build` : Lance la vérification des types et compile l'application pour la production dans le dossier dist.
- `npm run preview` : Permet de tester localement le rendu de la version compilée dans dist.

---

## Bonnes pratiques appliquées dans le projet

- **Code TypeScript strict** : Aucun usage de `any`, toutes les données de l'API et les fonctions ont des interfaces et des types précis.
- **Gestion des requêtes asynchrones** : Utilisation d'`AbortController` pour éviter les fuites de mémoire si l'utilisateur change de page pendant un chargement.
- **Validation des données saisies** : Contrôle des entrées de l'utilisateur avec des expressions régulières (Regex) pour éviter les valeurs incohérentes dans les filtres.
- **Accessibilité** : Utilisation de balises HTML sémantiques, d'attributs `aria-describedby`, `aria-invalid` et de rôles `alert` pour les messages d'erreur.
- **Organisation modulaire** : Séparation claire des responsabilités entre les composants graphiques, la gestion d'état, les hooks personnalisés et les tests.