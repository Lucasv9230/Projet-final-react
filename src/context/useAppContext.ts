import { useContext } from 'react';
import { AppContext, type AppContextValue } from './AppContextDefinition';

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext doit être utilisé dans AppProvider');
  return context;
}