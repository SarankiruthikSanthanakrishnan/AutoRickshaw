import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import OfflineOverlay from './OfflineOverlay';
import { useTheme } from './Theme';

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {children}
      <OfflineOverlay />
    </SafeAreaView>
  );
};

export default ScreenWrapper;
