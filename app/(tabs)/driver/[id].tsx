import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import {
  ArrowLeft,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { db } from '../../../config/firebase';
import { DriverData } from '../../../types';
import { useTheme } from '../../../utils/Theme';

export default function DriverDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();

  const [driver, setDriver] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const docRef = doc(db, 'drivers', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDriver({ id: docSnap.id, ...docSnap.data() } as DriverData);
        }
      } catch (error) {
        console.error('Error fetching driver:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDriver();
  }, [id]);

  if (loading) {
    return (
      <View
        style={[
          styles.safeArea,
          { backgroundColor: colors.background, justifyContent: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#0a66c2" />
      </View>
    );
  }

  if (!driver) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: colors.background }]}
      >
        <Text style={styles.errorText}>Driver not found</Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const profileUri = driver.image
    ? driver.image
    : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  const handleCall = () => {
    const url = `tel:${driver.phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: "Your device doesn't support calling from this app.",
          });
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const handleWhatsApp = () => {
    // Format phone number to remove + and spaces for wa.me link
    const cleanPhone = driver.phoneNumber.replace(/[\+\s]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=Hey I need ${driver.vehicleType} now`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'WhatsApp is not installed on your device.',
          });
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={styles.headerBack}
          onPress={() => router.back()}
        >
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Driver Details
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <Image
            source={{ uri: profileUri }}
            style={[styles.profileImage, { borderColor: colors.background }]}
          />
          <Text style={[styles.driverName, { color: colors.text }]}>
            {driver.name}
          </Text>
          <Text style={styles.subCategory}>{driver.subCategory}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <ShieldCheck color="#22c55e" size={16} />
              <Text style={styles.badgeText}>Verified</Text>
            </View>
            <View style={styles.badge}>
              <MapPin color="#0a66c2" size={16} />
              <Text style={[styles.badgeText, { color: '#0a66c2' }]}>
                Available
              </Text>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vehicle Number</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {driver.vehicleNumber}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {driver.category}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {driver.phoneNumber}
            </Text>
          </View>
        </View>

        {/* Actions Card */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            activeOpacity={0.8}
            onPress={handleCall}
          >
            <Phone color="#ffffff" size={22} />
            <Text style={styles.actionButtonText}>Call Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.waButton]}
            activeOpacity={0.8}
            onPress={handleWhatsApp}
          >
            <MessageCircle color="#ffffff" size={22} />
            <Text style={styles.actionButtonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerBack: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
  },
  driverName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subCategory: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16a34a',
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  actionsContainer: {
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  callButton: {
    backgroundColor: '#0a66c2', // Zoho style blue
  },
  waButton: {
    backgroundColor: '#25D366', // WhatsApp green
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#0f172a',
    fontWeight: '600',
  },
});
