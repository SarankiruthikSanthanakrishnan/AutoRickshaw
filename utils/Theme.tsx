import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useColorScheme();

  const colors =
    theme === 'dark'
      ? {
          background: '#0f172a', // Premium deep dark blue instead of pitch black
          text: '#f8fafc',
          card: '#1e293b',
          border: '#334155',
          placeholder: '#64748b',
          icon: '#94a3b8',
          primary: '#2563eb', // Zoho-style primary blue
          primaryLight: '#cce1ff',
          danger: '#ef4444',
          success: '#10b981',
          surface: '#334155',
        }
      : {
          background: '#f8fafc',
          text: '#0f172a',
          card: '#ffffff',
          border: '#e2e8f0',
          placeholder: '#94a3b8',
          icon: '#64748b',
          primary: '#0a66c2', // Corporate blue
          primaryLight: '#e0f2fe',
          danger: '#dc2626',
          success: '#059669',
          surface: '#f1f5f9',
        };

  return (
    <ThemeContext.Provider value={{ theme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
