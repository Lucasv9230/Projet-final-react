import { createContext } from 'react';

export type Theme = 'light' | 'dark';

export interface AppState {
  theme: Theme;
}

export interface AppContextValue extends AppState {
  toggleTheme: () => void;
}

export const AppContext = createContext<AppContextValue | null>(null);
