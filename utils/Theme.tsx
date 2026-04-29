import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          setThemeMode(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const changeThemeMode = async (mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const activeTheme = themeMode === 'system' ? (systemTheme || 'light') : themeMode;

  const colors =
    activeTheme === 'dark'
      ? {
          background: '#0f172a',
          text: '#f8fafc',
          card: '#1e293b',
          border: '#334155',
          placeholder: '#64748b',
          icon: '#94a3b8',
          primary: '#2563eb',
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
          primary: '#0a66c2',
          primaryLight: '#e0f2fe',
          danger: '#dc2626',
          success: '#059669',
          surface: '#f1f5f9',
        };

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, themeMode, changeThemeMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
