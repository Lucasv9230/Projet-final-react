# OpenSky Radar

🌐 **Online Project:** [https://projet-final-react-mu.vercel.app/](https://projet-final-react-mu.vercel.app/)

**Collaborative School Project**
This project was carried out as a group during our studies at Ynov Campus.
## Description

OpenSky Radar is a web application developed as part of our TypeScript and React course project.
It allows real-time tracking of aircraft flying over Europe (particularly France and neighboring countries) using data provided by the public OpenSky Network API.

The user can view the list of detected flights, search for a flight by its registration or GPS coordinates, filter by country of origin, sort by speed or altitude, and view a detailed file for each aircraft. The application also includes a complete toggle between a light mode and a dark mode.

### Technical Operation and Architecture

- The Vite proxy to bypass CORS:
The public OpenSky API normally blocks direct requests sent from a browser due to CORS security rules. To easily solve this problem, we configured a local proxy in the vite.config.ts file. When the application calls the `/api/opensky` address, the Vite server makes the request to the OpenSky Network and sends the data back to the application without any blocking.

- Separation of business logic in hooks:
The visual component does not directly handle requests or sorting. We separated the responsibilities:
1. The useOpenSkyFlights hook manages the network call with fetch, the loading status, errors, and formatting raw data into readable objects (speed in km/h, altitude in meters). It also uses an AbortController to cut the request if the user changes the page during loading.
2. The useFlightFilters hook takes the list of flights and applies the filters live with each user input (by plate, country, or coordinates) as well as the sorting.

- Global theme management with React Context:
The light or dark theme is shared throughout the application via AppContext and managed with useReducer. When the theme change button is clicked, a data-theme="dark" attribute is applied to the page and the CSS style adapts instantly using CSS variables.

- Routing:
Routing is managed with react-router-dom v6 in the RoutesFile component. A persistent Layout keeps the navigation bar on all pages, with a home page, the radar page, a dynamic detail page for each aircraft (/flight/:icao), an about page, and a 404 error page.

- Strict TypeScript typing:
The project is configured in strict mode and does not use any 'any' type. All data structures (aircraft, theme states, sorting parameters, API returns) are modeled by precise interfaces and types.

---

## Technologies Used

- React 19: main library for building the user interface in components.
- TypeScript: language used in strict mode to ensure code reliability and typing.
- Vite: fast build tool and local development server with API proxy management.
- React Router DOM v6: managing navigation between pages without reloading.
- Lucide React: lightweight vector icon library.
- Vitest and React Testing Library: execution environment and automated test writing.
- Oxlint: fast code linter to check TypeScript and React code quality.
- Vanilla CSS: custom styles with CSS variables for the light and dark theme, without a heavy framework.

---

## Features

- Live flight tracking: display of aircraft currently detected over the selected geographical area.
- Multi-criteria search: live search by registration (plate or callsign) and by position coordinates (latitude / longitude).
- Filter by country: drop-down menu generated automatically from the countries of currently detected flights.
- Custom sorting: priority sorting by speed (from slowest to fastest, or vice versa) and by altitude, with a default alphabetical sorting by country.
- Input validation: search field control with regular expressions to block invalid characters and display a clear error message.
- Dark mode and light mode: instant switching of the visual theme across all pages.
- Full navigation: home page with animated radar, tracking page, aircraft detail page with its ICAO identifier, about page, and a custom 404 page in case of a bad address.
- Clean network management: display of waiting states and error messages, with automatic cancellation of unfinished requests.

---

## Detailed Project Structure

```
Projet-final-react/
│
├── Configuration and root
│   ├── .gitignore
│   ├── .oxlintrc.json
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── run.bat
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

### Role of each root file

- .gitignore: tells Git which files and folders to ignore so as not to clutter the repository (node_modules, dist folder, local caches).
- .oxlintrc.json: configuration of the Oxlint linter which checks code compliance and React hook rules.
- index.html: base HTML file of the application that contains the div tag with root identifier in which React loads.
- package.json: lists the installed libraries, development dependencies, and project script commands.
- package-lock.json: records the exact versions of the installed packages to ensure an identical environment for the whole team.
- run.bat: script for Windows to install everything and launch the project automatically with one click.
- tsconfig.json: main TypeScript configuration file that coordinates client configuration and tool configuration.
- tsconfig.app.json: strict TypeScript compiler configuration for code located in the src folder.
- tsconfig.node.json: TypeScript configuration dedicated to Node tool files like vite.config.ts and vitest.config.ts.
- vite.config.ts: Vite setting file, containing the React plugin and the declaration of the proxy to the OpenSky API.
- vitest.config.ts: configuration of the Vitest testing environment with jsdom.
- README.md: full project documentation.

### The public/ folder

- public/favicon.svg: small airplane icon displayed in the web browser tab.
- public/icons.svg: grouping of SVG icons in vector format.

### The src/ folder

- src/main.tsx: React entry point that initializes the application in the DOM, enables StrictMode and starts BrowserRouter.
- src/RoutesFile.tsx: declares all site routes, wraps pages in the theme provider and configures the Layout with the navigation bar.
- src/App.tsx: home page presenting the project with a CSS radar animation and explanatory cards.
- src/index.css: base styles to reset margins and adapt the display to mobile screens.
- src/App.css: main stylesheet containing the dark and light mode variables, the flight table style, and animations.
- src/assets/vite.svg: vector logo of Vite kept in the resources.

### The src/components/ folder (Reusable components)

- src/components/NavBar.tsx: top navigation bar with links to the home and flight radar.
- src/components/Panel.tsx: reusable container component to display content with a border and a uniform background.
- src/components/StatusMessage.tsx: component to display an information message or a red error message depending on the variant.

### The src/context/ folder (Theme management)

- src/context/AppContextDefinition.ts: defines the TypeScript types of the theme (light or dark) and creates the React context instance.
- src/context/AppContext.tsx: AppProvider component that contains the useReducer to switch the theme and synchronize the html tag.
- src/context/useAppContext.ts: custom hook that simplifies access to the theme from any component.

### The src/hooks/ folder (Business logic and requests)

- src/hooks/useOpenSkyFlights.ts: handles making the request to the API via the proxy, manages loading, errors, and converts received data.
- src/hooks/useFlightFilters.ts: handles filtering logic (by text or by country) and sorting (speed and altitude), with the formatPosition utility function.

### The src/pages/ folder (Application pages)

- src/pages/FlyRadar.tsx: main page with the aircraft list, filter form, status messages, and theme button.
- src/pages/FlightDetails.tsx: page displaying the details of an aircraft selected by its identifier in the URL.
- src/pages/About.tsx: explanatory page on data origin and radar operation.
- src/pages/NotFound.tsx: 404 page displayed if an unknown route is requested, with a button to return to the home page.

### The src/test/ folder (Automated tests)

- src/test/setup.ts: loads jest-dom utilities to facilitate assertions on HTML elements in tests.
- src/test/App.test.tsx: integration tests verifying the home link, variants of the StatusMessage component, and filter form validation.
- src/test/useFlightFilters.test.ts: unit test verifying that the filtering hook correctly filters data according to the selected country.

---

## Installation and Launch

### Prerequisites
Have Node.js installed on your computer (the most recent version possible is recommended).

### Step 1: Clone the project
Open a terminal and clone the repository with the following command:

```bash
git clone https://github.com/Lucasv9230/Projet-final-react.git
cd Projet-final-react
```

### Step 2: Launch the project

#### Quick method with the .bat file (Windows)
At the root of the cloned folder, simply double-click the `run.bat` file.
This script takes care of everything automatically:
- It checks if the node_modules folder exists. If it does not exist, it automatically runs the `npm install` command.
- It starts the Vite development server in a command window.
- It waits a few seconds for the server to be ready then directly opens your browser to `http://localhost:5173`.

#### Manual command line method
If you prefer to launch the project manually from your terminal:

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your web browser to the address indicated by Vite (usually `http://localhost:5173`).

### Available Commands

- `npm run dev`: starts the local development server with auto-reload on each change.
- `npm run typecheck`: checks that all TypeScript types are valid without compiling files.
- `npm run lint`: runs code checking with Oxlint.
- `npm test`: runs automated tests with Vitest.
- `npm run build`: compiles the project for production in the dist folder.
- `npm run preview`: allows locally previewing the compiled project.

---

### 👥 Contributors

The project was carried out in a group of 4 students. We shared the tasks according to 4 main skill areas:

- Naël Morellon:
Setting up the working environment with Vite, React, and TypeScript. Configuring the development proxy in vite.config.ts to avoid CORS errors with the OpenSky Network API. Setting up the automated test suite (Vitest and React Testing Library), configuring the TypeScript compiler in strict mode in tsconfig.app.json, and integrating the 404 error page.

- Lucas Vauclin:
Navigation and routing architecture with React Router v6 (RoutesFile.tsx file). Creating the NavBar navigation bar, integrating the home page, first connection between the OpenSky API and the FlyRadar page, and creating the automated run.bat script for Windows.

- Anguelo Carathanasis:
Designing reusable graphical components (Panel and StatusMessage). Developing all the business logic for multi-criteria filters and sorting in the useFlightFilters hook, handling form validation, and fixing functional bugs.

- Romain Tholle:
Global design of the application and complete writing of the App.css stylesheet. Setting up dark mode and light mode with React Context and useReducer, radar animations (waves and visual sweep), harmonizing badges and tables, and writing the project documentation.
