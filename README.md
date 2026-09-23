# ✈️ OpenSky Radar — Suivi du Trafic Aérien en Direct

Application web moderne développée avec **React 19**, **TypeScript (mode strict)** et **Vite**.  
Le projet se connecte à l'API publique d'**OpenSky Network** pour récupérer, filtrer, trier et afficher en temps réel les aéronefs survolant l'Europe.

---

## 👥 Équipe et Répartition du Travail (Groupe de 4)

Le projet a été conçu et développé en **équipe de 4 personnes**. Le travail a été réparti de façon modulaire et équilibrée selon les domaines de compétences suivants :

| Membre | Rôle principal & Responsabilités | Réalisations majeures |
| :--- | :--- | :--- |
| **Naël Morellon** (`nael05`) | **Architecture socle, Setup & Tests** | • Initialisation du projet Vite + React + TypeScript.<br>• Configuration du proxy de développement OpenSky (`vite.config.ts`) pour contourner CORS.<br>• Configuration et mise en place de la suite de tests (Vitest + Testing Library).<br>• Typage strict TypeScript (`tsconfig.app.json`) et design de la page 404. |
| **Lucas Vauclin** (`Lucasv9230`) | **Routage, Intégration API & Workflow** | • Mise en place du routage complet avec `react-router-dom` v6 (`RoutesFile.tsx`).<br>• Développement de la barre de navigation (`NavBar.tsx`) et intégration de la vue radar.<br>• Intégration initiale du fetch des aéronefs OpenSky et passage des routes dynamiques.<br>• Création du script d'automatisation de démarrage (`start_project.bat`). |
| **Anguelo Carath** (`anguelo-code`) | **Composants UI modulaires & Logique de Filtrage** | • Conception des composants atomiques réutilisables (`Panel.tsx`, `StatusMessage.tsx`).<br>• Développement de la logique des filtres et du tri multi-critères (`useFlightFilters.ts`).<br>• Validation conditionnelle des formulaires et gestion des messages d'erreur.<br>• Résolution de bugs fonctionnels et optimisation de la logique d'état. |
| **Romain Tholle** (`romain`) | **UI/UX Design, Thème Global & Documentation** | • Conception intégrale du design moderne du tableau de bord (`App.css`).<br>• Implémentation du système de Dark / Light Mode via Context API et `useReducer`.<br>• Création des animations du radar (ondes, balayage, blips pulsants) et responsive design.<br>• Harmonisation visuelle (badges de plaque, cellules GPS) et rédaction de la documentation. |

---

## 🏗️ Architecture Globale et Fonctionnement Technique

### 1. Flux de données (Data Flow)
```
[ OpenSky Network API ]
          │ (Requête REST externe)
          ▼
[ Proxy local Vite (/api/opensky) ]
          │ (Contournement CORS & réécriture d'URL)
          ▼
[ Hook useOpenSkyFlights ]
          │ (Fetch asynchrone, typage, AbortController, mapping des coordonnées)
          ▼
[ Hook useFlightFilters ]
          │ (Filtrage pays/plaque/coordonnées, normalisation texte, tri vitesse/altitude)
          ▼
[ Pages & Composants UI ] (FlyRadar, FlightDetails, Panel, StatusMessage)
```

### 2. Contournement des restrictions CORS via Proxy Vite
L'API publique OpenSky Network bloque les requêtes directes provenant du navigateur (CORS). Pour résoudre ce problème sans backend lourd :
- Un proxy est configuré dans [vite.config.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/vite.config.ts).
- Tout appel vers `/api/opensky` est intercepté par le serveur de dev Vite et redirigé vers `https://opensky-network.org/api/states/all`.
- La zone géographique surveillée est restreinte via les paramètres de requête géographiques (Europe de l'Ouest / France : `lamin=42.0`, `lomin=-4.5`, `lamax=51.0`, `lomax=8.5`).

### 3. Gestion d'état (State Management)
- **État Global ([AppContext.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/context/AppContext.tsx))** : Utilise l'API Contexte combinée au hook `useReducer` pour gérer le thème (`light` / `dark`). Dès que le thème change, un attribut `data-theme` est appliqué dynamiquement à la racine HTML, ce qui déclenche instantanément la transition des variables CSS.
- **État Métier & Asynchrone ([useOpenSkyFlights.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/hooks/useOpenSkyFlights.ts))** : Gère les 3 états fondamentaux du chargement asynchrone (`loading`, `error`, `flights`), tout en évitant les fuites de mémoire grâce à `AbortController`.
- **État des Filtres ([useFlightFilters.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/hooks/useFlightFilters.ts))** : Gère la recherche textuelle par plaque, par position géographique, la sélection du pays, ainsi que les tris prioritaires (vitesse croissante/décroissante, altitude croissante/décroissante).

### 4. Typage strict TypeScript
Le projet applique la règle du **zéro `any`** :
- Les données brutes de l'API sont typées sous forme de tableau hétérogène `OpenSkyState` et enveloppées dans une interface générique `OpenSkyApiResponse<T>`.
- Les entités métiers sont strictement modélisées par des interfaces dédiées (`Flight`, `AppState`, `AppContextValue`).
- Les valeurs énumérables utilisent des unions de types stricts (`Theme = 'light' | 'dark'`, `SortOrder = 'none' | 'ascending' | 'descending'`, `StatusVariant = 'info' | 'error'`).

---

## 📁 Arborescence Complète et Explication Fichier par Fichier

```
Projet-final-react/
│
├── ⚙️ Configuration Racine
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
├── 📂 public/
│   ├── favicon.svg
│   └── icons.svg
│
└── 📂 src/
    ├── main.tsx
    ├── RoutesFile.tsx
    ├── App.tsx
    ├── index.css
    ├── App.css
    │
    ├── 📂 assets/
    │   └── vite.svg
    │
    ├── 📂 components/
    │   ├── NavBar.tsx
    │   ├── Panel.tsx
    │   └── StatusMessage.tsx
    │
    ├── 📂 context/
    │   ├── AppContextDefinition.ts
    │   ├── AppContext.tsx
    │   └── useAppContext.ts
    │
    ├── 📂 hooks/
    │   ├── useOpenSkyFlights.ts
    │   └── useFlightFilters.ts
    │
    ├── 📂 pages/
    │   ├── FlyRadar.tsx
    │   ├── FlightDetails.tsx
    │   ├── About.tsx
    │   └── NotFound.tsx
    │
    └── 📂 test/
        ├── setup.ts
        ├── App.test.tsx
        └── useFlightFilters.test.ts
```

---

### 1. Fichiers de Configuration et Racine

| Fichier | Rôle et Utilité détaillée |
| :--- | :--- |
| [.gitignore](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/.gitignore) | Spécifie à Git les dossiers et fichiers à ne pas versionner : `node_modules/`, dossiers de build `dist/`, fichiers de cache `.tmp`, `.local`, et fichiers d'environnement `.env`. |
| [.oxlintrc.json](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/.oxlintrc.json) | Fichier de configuration du linter ultra-rapide **Oxlint**. Active les règles de vérification pour React (notamment les règles strictes des Hooks `react/rules-of-hooks`) et TypeScript. |
| [index.html](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/index.html) | Point d'entrée HTML de l'application SPA (Single Page Application). Définit la balise `<div id="root"></div>` dans laquelle le composant React racine est monté, et charge le favicon ainsi que [src/main.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/main.tsx). |
| [package.json](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/package.json) | Manifeste du projet npm. Liste les métadonnées, les dépendances de production (`react`, `react-dom`, `react-router-dom`, `lucide-react`), les dépendances de développement (`vite`, `vitest`, `typescript`, `@testing-library/*`, `oxlint`), et les scripts d'exécution (`dev`, `build`, `typecheck`, `lint`, `test`, `preview`). |
| [package-lock.json](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/package-lock.json) | Arbre de dépendances verrouillé assurant des installations d'environnement déterministes et identiques sur les postes des 4 membres de l'équipe. |
| [start_project.bat](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/start_project.bat) | Script Batch Windows automatisé. Permet de lancer le projet en 1 double-clic : vérifie la présence de `package.json`, installe automatiquement les dépendances si `node_modules` est absent, lance le serveur local Vite dans un terminal dédié et ouvre automatiquement le navigateur web sur `http://localhost:5173`. |
| [tsconfig.json](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/tsconfig.json) | Fichier maître de TypeScript configuré en mode « références de projet » (*Project References*). Il lie les configurations spécifiques à l'application cliente ([tsconfig.app.json](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/tsconfig.app.json)) et à l'outillage Node ([tsconfig.node.json](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/tsconfig.node.json)). |
| [tsconfig.app.json](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/tsconfig.app.json) | Configuration stricte du compilateur TypeScript pour le code applicatif du dossier `src/` : cible `ES2023`, `strict: true`, interdiction des variables inutilisées (`noUnusedLocals`, `noUnusedParameters`), résolution moderne `bundler`, et exclusion de toute sortie JS (`noEmit: true`, Vite s'en chargeant). |
| [tsconfig.node.json](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/tsconfig.node.json) | Configuration TypeScript réservée aux fichiers de configuration exécutés dans l'environnement Node.js (tels que [vite.config.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/vite.config.ts) et [vitest.config.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/vitest.config.ts)). |
| [vite.config.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/vite.config.ts) | Configuration du bundler Vite. Intègre le plugin officiel `@vitejs/plugin-react` pour le support JSX/TSX et le Fast Refresh (HMR), et déclare le serveur proxy `/api/opensky` pour rediriger les requêtes vers l'API externe OpenSky sans blocage CORS. |
| [vitest.config.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/vitest.config.ts) | Configuration du framework de test **Vitest**. Spécifie l'environnement de rendu DOM synthétique (`jsdom`), le fichier de bootstrapping des tests ([src/test/setup.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/test/setup.ts)) et le pool d'exécution mono-thread pour des tests fiables. |
| [README.md](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/README.md) | Document de référence du projet (ce fichier), détaillant le rôle des membres, l'architecture logicielle, l'explication de tous les dossiers et fichiers, et le guide d'utilisation. |

---

### 2. Dossier `public/` (Fichiers Statiques)

| Fichier | Rôle et Utilité |
| :--- | :--- |
| [public/favicon.svg](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/public/favicon.svg) | Icône vectorielle SVG représentant un aéronef / radar, affichée dans l'onglet du navigateur web. |
| [public/icons.svg](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/public/icons.svg) | Fichier de sprites vectoriels SVG regroupant différentes icônes graphiques pouvant être référencées de façon optimisée. |

---

### 3. Dossier `src/` (Code Source Principal)

| Fichier | Rôle et Utilité |
| :--- | :--- |
| [src/main.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/main.tsx) | Point de démarrage JavaScript/React. Récupère l'élément `#root` du DOM, initialise `createRoot` de ReactDOM, active `StrictMode` pour détecter les effets de bord, et englobe l'application dans le `<BrowserRouter>` de React Router. |
| [src/RoutesFile.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/RoutesFile.tsx) | Déclare la structure de navigation et le routage de l'application. Encapsule toutes les routes dans `<AppProvider>` pour rendre le thème global accessible partout. Utilise un composant `<Layout>` avec `<NavBar>` et `<Outlet>` pour persister la navigation sur les pages enfants (`/`, `/flyradar`, `/flight/:icao`, `/about`), et définit la route d'erreur `*` vers [NotFound.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/pages/NotFound.tsx). |
| [src/App.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/App.tsx) | Page d'accueil de l'application (vue Hero). Présente le projet avec un visuel de radar animé en CSS (cercles concentriques, balayage, signaux détectés), un bouton d'action menant directement au radar, et une grille d'arguments/fonctionnalités clés utilisant les icônes `lucide-react`. |
| [src/index.css](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/index.css) | Styles CSS de base : reset universel des marges (`box-sizing: border-box`), typographie générale, couleur d'arrière-plan du `body` et règles d'adaptation responsive mobile (`@media (max-width: 760px)`). |
| [src/App.css](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/App.css) | Feuille de style principale du projet (plus de 500 lignes). Définit les palettes complètes en variables CSS `:root` pour le mode clair et `[data-theme="dark"]` pour le mode sombre, la typographie, les cartes de contenu, les animations radar (`radar-sweep`, `radar-blip-glow`), le tableau de suivi des vols, les filtres et les formulaires. |
| [src/assets/vite.svg](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/assets/vite.svg) | Asset graphique vectoriel du logo Vite. |

---

### 4. Dossier `src/components/` (Composants UI Réutilisables)

| Fichier | Rôle et Utilité |
| :--- | :--- |
| [src/components/NavBar.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/components/NavBar.tsx) | Composant de navigation principal. Propose les liens de navigation accessibles (`Accueil`, `Radar des vols`) grâce au composant `<Link>` de `react-router-dom` pour une navigation instantanée sans rechargement de page. |
| [src/components/Panel.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/components/Panel.tsx) | Conteneur générique réutilisable encapsulant du contenu avec des bordures et ombres homogènes. Accepte les props typées `children: ReactNode` et une classe CSS optionnelle `className`. |
| [src/components/StatusMessage.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/components/StatusMessage.tsx) | Composant d'alerte et de statut utilisateur. Accepte une variante typée (`info` par défaut, ou `error`), appliquant automatiquement les styles visuels appropriés pour informer l'utilisateur lors du chargement ou en cas d'erreur de requête API. |

---

### 5. Dossier `src/context/` (Gestion Globale du Thème)

| Fichier | Rôle et Utilité |
| :--- | :--- |
| [src/context/AppContextDefinition.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/context/AppContextDefinition.ts) | Définition des types et du contexte React pour l'état global. Définit le type `Theme = 'light' | 'dark'`, l'interface `AppState`, l'interface `AppContextValue` (avec la méthode `toggleTheme`), et crée l'instance `AppContext`. |
| [src/context/AppContext.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/context/AppContext.tsx) | Fournisseur de contexte (`AppProvider`). Implémente un `useReducer` avec une action typée `toggle-theme` pour basculer de façon immuable entre clair et sombre. Un hook `useEffect` synchronise l'état avec l'attribut HTML `data-theme="dark"` sur `document.documentElement`. |
| [src/context/useAppContext.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/context/useAppContext.ts) | Hook personnalisé facilitateur (*custom consumer hook*). Permet à n'importe quel composant d'accéder au contexte applicatif en toute sécurité ; déclenche une erreur explicite si le hook est utilisé en dehors d'un `<AppProvider>`. |

---

### 6. Dossier `src/hooks/` (Logique Métier et Requêtes API)

| Fichier | Rôle et Utilité |
| :--- | :--- |
| [src/hooks/useOpenSkyFlights.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/hooks/useOpenSkyFlights.ts) | Hook gérant la récupération des données de vol en direct depuis l'API OpenSky Network. Exécute un `fetch` sur `/api/opensky` avec `AbortController` pour annuler la requête lors du démontage du composant. Mappe les index bruts du tableau `states` vers des objets métier fortement typés `Flight` (conversion de la vitesse m/s en km/h, arrondis d'altitude, gestion des valeurs nulles). |
| [src/hooks/useFlightFilters.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/hooks/useFlightFilters.ts) | Hook contenant toute la logique de tri et de filtrage des aéronefs. Extrait la liste unique des pays disponibles, effectue les recherches textuelles (plaque d'immatriculation et coordonnées GPS via la fonction utilitaire exportée `formatPosition`), applique les tris numériques prioritaires (vitesse ou altitude avec gestion des valeurs nulles), et fournit une fonction `resetFilters`. |

---

### 7. Dossier `src/pages/` (Vues de l'Application)

| Fichier | Rôle et Utilité |
| :--- | :--- |
| [src/pages/FlyRadar.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/pages/FlyRadar.tsx) | Page centrale de l'application. Affiche le tableau de bord interactif : bouton de bascule du thème clair/sombre (`ThemeToggle`), formulaire complet de filtrage (par pays, plaque avec validation Regex, coordonnées de position, tris vitesse et altitude), affichage des erreurs de validation accessibles (`role="alert"`), messages de statut (chargement / erreur), et tableau des vols avec badges stylisés et liens vers les fiches détaillées. |
| [src/pages/FlightDetails.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/pages/FlightDetails.tsx) | Page de détail d'un aéronef spécifique. Utilise le hook `useParams<{ icao: string }>()` de React Router pour extraire l'identifiant de vol depuis l'URL dynamique `/flight/:icao`, et propose un bouton pour revenir au radar. |
| [src/pages/About.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/pages/About.tsx) | Page d'information (« À propos »). Présente brièvement l'origine des données du trafic aérien fournies par le réseau OpenSky Network. |
| [src/pages/NotFound.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/pages/NotFound.tsx) | Page d'erreur 404 sur mesure (« Signal perdu »). Affiche une animation orbitale épurée en CSS et utilise le hook `useNavigate()` de React Router pour rediriger l'utilisateur vers la page d'accueil en un clic. |

---

### 8. Dossier `src/test/` (Tests Automatisés)

| Fichier | Rôle et Utilité |
| :--- | :--- |
| [src/test/setup.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/test/setup.ts) | Fichier d'initialisation des tests Vitest. Importe `@testing-library/jest-dom/vitest` afin d'étendre les assertions `expect` avec des comparateurs orientés DOM (`toBeInTheDocument()`, `toHaveClass()`, `toBeDisabled()`, etc.). |
| [src/test/App.test.tsx](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/test/App.test.tsx) | Tests d'intégration des composants :<br>1. Vérifie la présence du lien de navigation vers `/flyradar` sur la page d'accueil.<br>2. Vérifie le rendu conditionnel du composant `StatusMessage` (variante par défaut vs variante erreur avec la classe `.error`).<br>3. Vérifie la validation conditionnelle du formulaire de filtres dans `FlyRadar` (blocage de la soumission et affichage du message d'erreur si des caractères invalides sont saisis dans la plaque). |
| [src/test/useFlightFilters.test.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/test/useFlightFilters.test.ts) | Test unitaire du hook personnalisé `useFlightFilters` via `renderHook` de Testing Library. Vérifie que le filtrage par pays isole rigoureusement l'aéronef correspondant sans modifier la liste originale. |

---

## 🚀 Installation et Lancement

### Prérequis
- **Node.js** version 20 ou supérieure installée sur votre machine.
- Un gestionnaire de paquets (`npm` inclus avec Node.js).

### Option 1 : Lancement en un clic (Windows)
Un script batch prêt à l'emploi est disponible à la racine du projet :
1. Double-cliquez sur **[start_project.bat](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/start_project.bat)**.
2. Le script installe automatiquement les dépendances si nécessaire, lance le serveur de développement Vite et ouvre votre navigateur par défaut à l'adresse `http://localhost:5173`.

### Option 2 : Lancement manuel en ligne de commande

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Démarrer le serveur de développement** :
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:5173`.

---

## 🛠️ Commandes Disponibles

| Commande | Action |
| :--- | :--- |
| `npm run dev` | Démarre le serveur local de développement Vite avec Hot Module Replacement (HMR). |
| `npm run typecheck` | Lance la vérification des types TypeScript sur l'ensemble du projet sans générer de fichiers (`tsc -b`). |
| `npm run lint` | Analyse le code source avec **Oxlint** pour détecter les erreurs de syntaxe et les violations des règles React / TypeScript. |
| `npm test` | Exécute la suite de tests automatisés avec **Vitest**. |
| `npm run build` | Effectue la vérification des types puis compile le bundle de production optimisé dans le dossier `dist/`. |
| `npm run preview` | Prévisualise localement le build de production généré dans `dist/`. |

---

## 🛡️ Bonnes Pratiques Implémentées

1. **Robustesse Asynchrone** : Utilisation d'`AbortController` et d'un drapeau d'activité booléen (`isActive`) dans [useOpenSkyFlights.ts](file:///c:/Users/romin/Desktop/cours-projet/TypeScript/Projet-final-react/src/hooks/useOpenSkyFlights.ts) pour prévenir les fuites de mémoire et les conflits de requêtes (*race conditions*).
2. **Accessibilité (a11y)** : Formulaires dotés d'attributs `aria-describedby`, `aria-invalid` et messages d'alerte configurés avec `role="alert"`.
3. **Validation Réactive** : Expression régulière stricte pour la validation des formats d'immatriculation d'aéronefs et de saisie de coordonnées de latitude/longitude.
4. **Performance** : Absence d'optimisations prématurées non mesurées (`useMemo`, `useCallback`) conformément aux recommandations de l'écosystème React 19.
5. **Separation of Concerns (SoC)** : Découplage net entre l'affichage (pages / composants), la logique métier (hooks personnalisés), la gestion d'état (contexte / réducteur) et l'accès aux données (proxy d'API).