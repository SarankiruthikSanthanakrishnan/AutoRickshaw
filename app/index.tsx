import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../utils/Theme';

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the progress bar over 2 seconds
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      // Transition to Home once finished
      router.replace('/(tabs)/Home');
    });
  }, []);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ImageBackground
        source={require('../assets/images/splash-full.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.bottomContainer}>
              <Text style={styles.loadingText}>Loading App...</Text>
              <View style={styles.progressBarBg}>
                <Animated.View style={[styles.progressBar, { width }]} />
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Clean white background matching new theme
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Subtle dark overlay to ensure text is visible
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 80,
  },
  bottomContainer: {
    width: '75%',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#facc15', 
    borderRadius: 3,
  },
});
