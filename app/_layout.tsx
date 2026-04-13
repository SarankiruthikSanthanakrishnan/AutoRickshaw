import { Stack } from 'expo-router';
import ScreenWrapper from '../utils/ScreenWrapper';
import { ThemeProvider } from '../utils/Theme';
import { AuthProvider } from '../utils/AuthContext';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ScreenWrapper>
          <Stack screenOptions={{ headerShown: false }} />
        </ScreenWrapper>
        <Toast />
      </ThemeProvider>
    </AuthProvider>
  );
}
