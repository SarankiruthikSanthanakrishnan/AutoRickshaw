import { WifiOff } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useConnectivity } from './ConnectivityContext';
import { useTheme } from './Theme';

const OfflineOverlay = () => {
  const { isConnected, isInternetReachable } = useConnectivity();
  const { colors } = useTheme();

  const isOnline = !!isConnected && !!isInternetReachable;

  if (isOnline) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: colors.background + 'CC' }]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.danger + '15' }]}>
          <WifiOff color={colors.danger} size={48} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>No Internet Connection</Text>
        <Text style={[styles.message, { color: colors.placeholder }]}>
          Please check your connection and try again. The app will resume once you are back online.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default OfflineOverlay;
