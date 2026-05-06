import { Redirect, useRouter } from 'expo-router';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { Edit, LogOut, Trash2, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { db } from '../../config/firebase';
import { DriverData } from '../../types';
import { useAuth } from '../../utils/AuthContext';
import LoadingAnimation from '../../utils/LoadingAnimation';
import { useTheme } from '../../utils/Theme';

export default function AdminDashboard() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [loading, setLoading] = useState(true);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) {
      return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
    }
    if (digits.length === 10) {
      return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    return value;
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'drivers'),
      (snapshot) => {
        const driversData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as DriverData[];
        setDrivers(driversData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching drivers', error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Driver',
      'Are you sure you want to delete this driver?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'drivers', id));
            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Delete Failed',
                text2: error.message,
              });
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: DriverData }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[styles.cardHeader, { borderBottomColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.driverAvatar} />
          ) : (
            <User color={colors.primary} size={24} />
          )}
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <View
              style={[
                styles.badgeContainer,
                { backgroundColor: colors.surface || colors.background },
              ]}
            >
              <Text style={[styles.badgeText, { color: colors.placeholder }]}>
                {item.vehicleType || item.category}
              </Text>
            </View>
            <View
              style={[
                styles.badgeContainer,
                { backgroundColor: (!item.status || item.status === 'active') ? '#dcfce7' : '#fee2e2' },
              ]}
            >
              <Text style={[styles.badgeText, { color: (!item.status || item.status === 'active') ? '#16a34a' : '#ef4444' }]}>
                {(!item.status || item.status === 'active') ? 'Active' : 'Deactive'}
              </Text>
            </View>
          </View>
          <Text style={[styles.phone, { color: colors.icon }]}>
            {formatPhoneNumber(item.phoneNumber)}
          </Text>
        </View>
      </View>

      <View style={[styles.actions, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            styles.editBtn,
            { borderRightColor: colors.border },
          ]}
          onPress={() => router.push(`/(admin-tabs)/edit/${item.id}` as any)}
        >
          <Edit color={colors.primary} size={16} style={styles.actionIcon} />
          <Text style={[styles.editBtnText, { color: colors.primary }]}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item.id)}
        >
          <Trash2 color={colors.danger} size={16} style={styles.actionIcon} />
          <Text style={[styles.deleteBtnText, { color: colors.danger }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!user) return <Redirect href="/(tabs)/Home" />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Drivers
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity
            onPress={signOut}
            style={[
              styles.logoutButton,
              { backgroundColor: colors.danger + '15' },
            ]}
          >
            <LogOut color={colors.danger} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <LoadingAnimation />
        </View>
      ) : (
        <FlatList
          data={drivers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: colors.placeholder, fontSize: 16 }}>
                No drivers found.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a66c2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 6,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  listContainer: {
    padding: 24,
    gap: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: '#e0f2fe',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  driverAvatar: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  phone: {
    fontSize: 14,
    color: '#64748b',
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  editBtn: {
    borderRightWidth: 1,
  },
  deleteBtn: {},
  actionIcon: {
    marginRight: 8,
  },
  editBtnText: {
    color: '#0a66c2',
    fontWeight: '600',
  },
  deleteBtnText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});
