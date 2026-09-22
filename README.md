# OpenSky Radar

Application Vite + React + TypeScript permettant d'explorer les aéronefs détectés par OpenSky Network.

## Installation et lancement

Prérequis : Node.js 20 ou une version plus récente.

```bash
npm install
npm run dev
```

L'application est alors disponible sur l'URL affichée par Vite. Le proxy de développement `/api/opensky` redirige les appels vers OpenSky Network. Vite fournit le HMR : les modifications de composants sont visibles sans redémarrage manuel.

Commandes utiles :

```bash
npm run typecheck
npx tsc --noEmit
npm run lint
npm test
npm run build
npm run preview
```

## Compétences démontrées

* TypeScript strict : types primitifs, interfaces (`Flight`, `AppState`), unions (`Theme`, `SortOrder`, `StatusVariant`) et générique `OpenSkyApiResponse<T>`. Aucun `any` n'est utilisé.
* Configuration : `strict` active les vérifications strictes ; `noUnusedLocals` et `noUnusedParameters` détectent le code inutilisé ; `moduleResolution: "bundler"` adapte la résolution aux imports Vite. `noEmit` empêche TypeScript de produire des fichiers, Vite prenant en charge le bundle.
* Composants : plus de huit composants typés, dont `Panel` et `StatusMessage` réutilisables. `Panel` accepte `children` via une interface de props.
* Hooks : `useState`, `useEffect`, `useContext` et `useReducer` sont utilisés dans leurs responsabilités respectives. `useFlightFilters` factorise les filtres et `useOpenSkyFlights` factorise le chargement API.
* Formulaire : les champs de filtre sont contrôlés. Les valeurs invalides affichent une erreur au champ et désactivent la soumission ; un test vérifie ce comportement.
* Routage React Router v6 : accueil, radar, détail `/flight/:icao`, à-propos et 404. `Layout` utilise `Outlet` et la page 404 utilise `useNavigate`.
* État global : `AppProvider` partage le thème et le gère avec `useReducer`, en retournant de nouveaux objets d'état.
* Asynchrone : les états chargement, erreur et succès sont affichés. `AbortController` et un drapeau d'activité empêchent les mises à jour après nettoyage ou course entre effets.
* Tests : Vitest et Testing Library couvrent le lien d'accueil, les deux variantes de message, le filtrage par pays et la validation conditionnelle du formulaire.

## Performance

Avant toute optimisation, le composant peut être entouré par `Profiler` de React pour mesurer `actualDuration` et `baseDuration` pendant un filtrage. Le projet n'ajoute pas `memo`, `useMemo` ou `useCallback` sans mesure montrant un gain nécessaire.

## Hébergement

L'application est hébergée et déployée sur **Vercel**.

Le build de production est généré avec `npm run build` dans `dist/`. Vercel assure automatiquement le déploiement de l'application à partir du dépôt Git.
