import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../utils/Theme';

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      router.replace('/(tabs)/Home');
      // router.push('/(admin-tabs)/Login');
    }
  }, [ready]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}
    >
      <Text style={{ color: colors.text }}>Loading...</Text>
    </View>
  );
}
