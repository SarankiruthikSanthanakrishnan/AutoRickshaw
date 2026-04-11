import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Edit, Trash2, User } from 'lucide-react-native';
import { Driver } from '../../types';

// Mock Initial Data
const INITIAL_DRIVERS: Driver[] = [
  { id: '1', name: 'Ramesh Kumar', vehicleType: 'Auto', phoneNumber: '+91 9876543210' },
  { id: '2', name: 'Suresh Raina', vehicleType: 'Van', phoneNumber: '+91 8765432109' },
  { id: '3', name: 'Muthu', vehicleType: 'Share Auto', phoneNumber: '+91 7654321098' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Driver', 'Are you sure you want to delete this driver?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: () => setDrivers((prev) => prev.filter((d) => d.id !== id)) 
      },
    ]);
  };

  const renderItem = ({ item }: { item: Driver }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <User color="#0a66c2" size={24} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{item.vehicleType}</Text>
          </View>
          <Text style={styles.phone}>{item.phoneNumber}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => router.push(`/(admin-tabs)/edit/${item.id}` as any)}
        >
          <Edit color="#0a66c2" size={16} style={styles.actionIcon} />
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item.id)}
        >
          <Trash2 color="#ef4444" size={16} style={styles.actionIcon} />
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Drivers</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/(admin-tabs)/add' as any)}
          activeOpacity={0.8}
        >
          <Plus color="#ffffff" size={20} />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
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
  listContainer: {
    padding: 24,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    borderBottomColor: '#f1f5f9',
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: '#e0f2fe',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
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
    backgroundColor: '#f8fafc',
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
    borderRightColor: '#e2e8f0',
  },
  deleteBtn: {
  },
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
