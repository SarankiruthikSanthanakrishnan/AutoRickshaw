import { StyleSheet, View, Text, ScrollView, SafeAreaView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { MapPin, Navigation, CarFront, Clock, Info, ShieldCheck } from 'lucide-react-native';
import { Feature } from '@/types';

const features: Feature[] = [
  { id: '1', title: 'Local Routes', desc: 'Find quick rickshaws near you.', IconComponent: MapPin, iconColor: '#007bff', iconSize: 32 },
  { id: '2', title: 'Outstation Travel', desc: 'Book cabs for long journeys.', IconComponent: Navigation, iconColor: '#28a745', iconSize: 32 },
  { id: '3', title: 'Rental Vehicles', desc: 'Rent a car or auto for the day.', IconComponent: CarFront, iconColor: '#ffc107', iconSize: 32 },
  { id: '4', title: 'Advance Booking', desc: 'Schedule a ride for tomorrow.', IconComponent: Clock, iconColor: '#dc3545', iconSize: 32 },
  { id: '5', title: 'About Travels', desc: 'Details about our fleet and company.', IconComponent: Info, iconColor: '#17a2b8', iconSize: 32 },
  { id: '6', title: 'Safety First', desc: 'Verified drivers and GPS tracking.', IconComponent: ShieldCheck, iconColor: '#6c757d', iconSize: 32 },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Services</Text>
        <Text style={styles.headerSubtitle}>Discover all our travel offerings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {features.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card}>
              <View style={styles.iconContainer}>
                <item.IconComponent color={item.iconColor} size={item.iconSize} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#343a40',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6c757d',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconContainer: {
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#6c757d',
    lineHeight: 18,
  },
});
