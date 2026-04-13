import { AuthProvider } from '@/utils/AuthContext';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { ConnectivityProvider } from '../utils/ConnectivityContext';
import ScreenWrapper from '../utils/ScreenWrapper';
import { ThemeProvider } from '../utils/Theme';

export default function RootLayout() {
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
