import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../utils/Theme';

interface LoadingAnimationProps {
  size?: number;
  color?: string;
}

export default function LoadingAnimation({
  size = 48,
  color,
}: LoadingAnimationProps) {
  const { colors } = useTheme();
  const themeColor = color || colors.primary || '#0a66c2';

  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.5, { duration: 1200, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: 1200, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: themeColor,
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          animatedStyle,
        ]}
      />
      <View
        style={[
          styles.innerCircle,
          {
            backgroundColor: themeColor,
            width: size * 0.4,
            height: size * 0.4,
            borderRadius: size * 0.2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
  },
  innerCircle: {
    position: 'absolute',
  },
});
