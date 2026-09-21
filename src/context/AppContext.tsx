import { useEffect, useReducer, type ReactNode } from 'react';
import { AppContext, type AppState } from './AppContextDefinition';

type AppAction = { type: 'toggle-theme' };

const initialState: AppState = { theme: 'light' };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'toggle-theme':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ ...state, toggleTheme: () => dispatch({ type: 'toggle-theme' }) }}>
      {children}
    </AppContext.Provider>
  );
}
