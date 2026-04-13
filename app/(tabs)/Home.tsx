import { useRouter } from 'expo-router';
import { Bus, Car } from 'lucide-react-native';
import { useRef } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../utils/Theme';

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();

  const lastTap = useRef<number>(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DELAY = 300;
    if (lastTap.current && now - lastTap.current < DELAY) {
      router.push('/(admin-tabs)/Login' as any);
    } else {
      lastTap.current = now;
    }
  };

  const handlePress = (category: string) => {
    router.push({ pathname: '/(tabs)/List', params: { category } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleDoubleTap}
            activeOpacity={1}
            style={styles.secretButton}
          >
            <Image
              source={{
                uri: 'https://res.cloudinary.com/dzadw7z7l/image/upload/v1776014197/icon_m8hkbv.jpg',
              }}
              style={styles.logo}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Transport Booking
          </Text>
          <Text style={styles.headerSubtitle}>Select your ride category</Text>
        </View>

        <View style={styles.cardContainer}>
          {/* Auto Container */}
          <TouchableOpacity
            style={[
              styles.card,
              styles.autoCard,
              { backgroundColor: colors.background },
            ]}
            activeOpacity={0.8}
            onPress={() => handlePress('Auto')}
          >
            <View style={styles.cardContent}>
              <Car color="#0a66c2" size={40} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Auto & Share Auto
              </Text>
              <Text style={styles.cardDesc}>Quick rides for city travel</Text>
            </View>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1593027814880-9274fcce0625?auto=format&fit=crop&q=80&w=300',
              }}
              style={styles.cardImage}
            />
          </TouchableOpacity>

          {/* Van Container */}
          <TouchableOpacity
            style={[
              styles.card,
              styles.vanCard,
              { backgroundColor: colors.background },
            ]}
            activeOpacity={0.8}
            onPress={() => handlePress('Car & Travels')}
          >
            <View style={styles.cardContent}>
              <Bus color="#0ea5e9" size={40} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Cars and Travels
              </Text>
              <Text style={styles.cardDesc}>Spacious travels for groups</Text>
            </View>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1620023023027-6f6eb855fdcc?auto=format&fit=crop&q=80&w=300',
              }}
              style={styles.cardImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  secretButton: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  header: {
    marginBottom: 32,
    marginTop: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  cardContainer: {
    gap: 20,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 140,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // Shadow for Android
    elevation: 8,
  },
  autoCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#0a66c2',
  },
  vanCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#0ea5e9',
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#94a3b8',
  },
  cardImage: {
    width: 120,
    height: '100%',
  },
});
