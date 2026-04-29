import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import { Bus, Car, ChevronRight, MapPin, Moon, Sun, Monitor } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { db } from '../../config/firebase';
import { BannerData } from '../../types';
import { useTheme } from '../../utils/Theme';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const { colors, themeMode, changeThemeMode } = useTheme();

  const [banners, setBanners] = useState<BannerData[]>([]);
  const [locationName, setLocationName] = useState('Fetching location...');
  const lastTap = useRef<number>(0);
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'banners'), (snapshot) => {
      const bannerData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BannerData[];
      // Sort to show newest banners first
      bannerData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setBanners(bannerData);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationName('Location permission denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const [geocode] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (geocode) {
          const city = geocode.city || geocode.subregion || geocode.region || 'Unknown';
          setLocationName(`${city}, ${geocode.isoCountryCode || ''}`);
        } else {
          setLocationName('Location found');
        }
      } catch (error) {
        console.error(error);
        setLocationName('Location Error');
      }
    })();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= banners.length) {
          nextIndex = 0;
        }
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentIndex(nextIndex);
      }, 3000); // 3 seconds interval
      return () => clearInterval(interval);
    }
  }, [currentIndex, banners.length]);

  const toggleTheme = () => {
    if (themeMode === 'system') changeThemeMode('light');
    else if (themeMode === 'light') changeThemeMode('dark');
    else changeThemeMode('system');
  };

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

  const renderBanner = ({ item }: { item: BannerData }) => (
    <View style={styles.bannerWrapper}>
      <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: colors.card, shadowColor: colors.text }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greetingText}>Good Morning,</Text>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Where to today?</Text>
            </View>
            <TouchableOpacity
              onPress={handleDoubleTap}
              activeOpacity={1}
            >
              <Image
                source={{
                  uri: 'https://res.cloudinary.com/dzadw7z7l/image/upload/v1776014197/icon_m8hkbv.jpg',
                }}
                style={[styles.logo, { borderColor: colors.background }]}
              />
            </TouchableOpacity>
          </View>
          
          {/* Location Bar & Theme Toggle */}
          <View style={styles.headerControlsRow}>
            <View style={[styles.locationBar, { backgroundColor: colors.background }]}>
              <MapPin color="#0a66c2" size={20} />
              <Text style={[styles.locationText, { color: colors.text }]}>{locationName}</Text>
            </View>
            <TouchableOpacity 
              onPress={toggleTheme} 
              style={[styles.themeToggleBtn, { backgroundColor: colors.background }]}
            >
              {themeMode === 'system' ? <Monitor color={colors.icon} size={20} /> :
               themeMode === 'light' ? <Sun color="#f59e0b" size={20} /> :
               <Moon color="#818cf8" size={20} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Banners Section */}
        {banners.length > 0 && (
          <View style={styles.bannerContainer}>
            <FlatList
              ref={flatListRef}
              data={banners}
              keyExtractor={(item) => item.id}
              renderItem={renderBanner}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              decelerationRate="fast"
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentIndex(index);
              }}
            />
          </View>
        )}

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ride Categories</Text>

          <View style={styles.cardContainer}>
            {/* Auto Container */}
            <TouchableOpacity
              style={[styles.card, styles.autoCard, { backgroundColor: colors.card, shadowColor: colors.text, borderColor: colors.border }]}
              activeOpacity={0.9}
              onPress={() => handlePress('Auto')}
            >
              <View style={[styles.cardContent, { backgroundColor: colors.card + 'D9' }]}>
                <View style={[styles.iconBox, { backgroundColor: '#e0f2fe' }]}>
                  <Car color="#0a66c2" size={28} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Auto & Share Auto</Text>
                  <Text style={styles.cardDesc}>Quick, affordable city rides</Text>
                </View>
                <ChevronRight color={colors.icon} size={24} />
              </View>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1593027814880-9274fcce0625?auto=format&fit=crop&q=80&w=400',
                }}
                style={styles.cardBackgroundImage}
              />
            </TouchableOpacity>

            {/* Van Container */}
            <TouchableOpacity
              style={[styles.card, styles.vanCard, { backgroundColor: colors.card, shadowColor: colors.text, borderColor: colors.border }]}
              activeOpacity={0.9}
              onPress={() => handlePress('Car & Travels')}
            >
              <View style={[styles.cardContent, { backgroundColor: colors.card + 'D9' }]}>
                <View style={[styles.iconBox, { backgroundColor: '#f3e8ff' }]}>
                  <Bus color="#9333ea" size={28} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Cars and Travels</Text>
                  <Text style={styles.cardDesc}>Spacious travels for groups</Text>
                </View>
                <ChevronRight color={colors.icon} size={24} />
              </View>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1620023023027-6f6eb855fdcc?auto=format&fit=crop&q=80&w=400',
                }}
                style={styles.cardBackgroundImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#f1f5f9',
  },
  headerControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  themeToggleBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  bannerContainer: {
    marginTop: 24,
    height: 180,
  },
  bannerWrapper: {
    width: width,
    paddingHorizontal: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'cover',
  },
  categoriesSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  cardContainer: {
    gap: 20,
  },
  card: {
    height: 140,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
    position: 'relative',
  },
  autoCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  vanCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent to let background image peek through
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  cardBackgroundImage: {
    position: 'absolute',
    right: -40,
    bottom: -20,
    width: 200,
    height: 200,
    opacity: 0.15,
    resizeMode: 'contain',
  },
});
