import { useState, useMemo, createContext, useContext } from 'react';
import light from './light';
import dark from './dark';

const ThemeModeContext = createContext();

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => (mode === 'light' ? light : dark), [mode]);

  const value = { theme, mode, toggle: () => setMode(m => (m === 'light' ? 'dark' : 'light')) };

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);  
}
