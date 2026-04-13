import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function Index() {
  const router = useRouter();
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
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/splash-full.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <View style={styles.bottomContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
            <View style={styles.progressBarBg}>
              <Animated.View style={[styles.progressBar, { width }]} />
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
    backgroundColor: '#01241a', // Dark emerald matching splash
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
  },
  bottomContainer: {
    width: '80%',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    letterSpacing: 1,
  },
  progressBarBg: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#facc15', // Golden color matching branding
    borderRadius: 2,
  },
});
