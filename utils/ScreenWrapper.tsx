import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from './Theme';

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {children}
    </SafeAreaView>
  );
};

export default ScreenWrapper;
