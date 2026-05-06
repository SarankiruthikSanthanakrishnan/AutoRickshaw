import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../utils/AuthContext';
import { ConnectivityProvider } from '../utils/ConnectivityContext';
import ScreenWrapper from '../utils/ScreenWrapper';
import { ThemeProvider } from '../utils/Theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay once the main layout is ready
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ConnectivityProvider>
      <AuthProvider>
        <ThemeProvider>
          <ScreenWrapper>
            <Stack screenOptions={{ headerShown: false }} />
          </ScreenWrapper>
          <Toast />
        </ThemeProvider>
      </AuthProvider>
    </ConnectivityProvider>
  );
}
