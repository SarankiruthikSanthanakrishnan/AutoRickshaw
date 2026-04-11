import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, TextInput } from 'react-native';
import { mockDrivers } from '../../data';
import { Search, Star, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import { useState } from 'react';

export default function ListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const category = params.category as string;
  const [searchQuery, setSearchQuery] = useState('');

  // Filter based on category and search query
  const filteredDrivers = mockDrivers.filter(d => {
    const matchesCategory = category ? d.category === category : true;
    const matchesSearch = d.subCategory!.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDriverPress = (id: string) => {
    router.push({ pathname: '/(tabs)/driver/[id]', params: { id } });
  };

  const renderItem = ({ item }: { item: typeof mockDrivers[0] }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      onPress={() => handleDriverPress(item.id)}
    >
      <View style={styles.imageSection}>
        {/* Main Vehicle Image Component */}
        <View style={styles.vehicleImageContainer}>
          <Image source={{ uri: item.image }} style={styles.vehicleImage} />
        </View>
        
        {/* Duplicate Image Container -> Driver Profile Image Component */}
        <View style={styles.driverProfileContainer}>
          <Image source={{ uri: item.driverImage }} style={styles.driverImage} />
          <View style={styles.onlineBadge} />
        </View>
      </View>
      
      <View style={styles.cardInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.driverName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Star color="#eab308" size={14} fill="#eab308" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.subCategory}>{item.subCategory} • {item.vehicleNumber}</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>{item.price}</Text>
          <View style={styles.verifiedBadge}>
            <CheckCircle2 color="#16a34a" size={12} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>
      </View>

      <View style={styles.chevronContainer}>
        <ChevronRight color="#cbd5e1" size={24} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find your ride...</Text>
        
        <View style={styles.searchBox}>
          <Search color="#94a3b8" size={20} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search driver, vehicle or category..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredDrivers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No matches found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#334155',
  },
  listContainer: {
    padding: 20,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    // Zoho professional shadow
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  imageSection: {
    position: 'relative',
    width: 80,
    height: 80,
    marginRight: 16,
  },
  vehicleImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  driverProfileContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  driverImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  cardInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef9c3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#854d0e',
  },
  subCategory: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0a66c2', // Zoho Blue
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16a34a',
  },
  chevronContainer: {
    marginLeft: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 15,
  },
});
