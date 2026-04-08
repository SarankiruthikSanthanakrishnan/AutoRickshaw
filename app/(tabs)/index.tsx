import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
  StatusBar
} from 'react-native';
import { 
  UserCircle, 
  Menu,
  Bell,
  TrendingUp,
  TrendingDown,
  Activity,
  Car,
  DollarSign
} from 'lucide-react-native';
import { DashboardMetric, RecentBooking } from '@/types';

const metrics: DashboardMetric[] = [
  { id: 'm1', title: 'Total Revenue', value: '₹45,230', trend: 'up', trendValue: '+12.4%', IconComponent: DollarSign, iconColor: '#059669' },
  { id: 'm2', title: 'Active Rides', value: '142', trend: 'neutral', trendValue: 'Same as yesterday', IconComponent: Activity, iconColor: '#2563eb' },
  { id: 'm3', title: 'Idle Vehicles', value: '18', trend: 'down', trendValue: '-5.2%', IconComponent: Car, iconColor: '#dc2626' },
];

const resentBookings: RecentBooking[] = [
  { id: 'b1', customerName: 'Ramesh K.', pickup: 'Central Station', dropoff: 'Adyar', date: 'Today, 10:30 AM', status: 'Completed', price: '₹480' },
  { id: 'b2', customerName: 'Suresh V.', pickup: 'Airport', dropoff: 'T Nagar', date: 'Today, 11:15 AM', status: 'Pending', price: '₹1200' },
  { id: 'b3', customerName: 'Priya M.', pickup: 'OMR', dropoff: 'Velachery', date: 'Today, 1:00 PM', status: 'Cancelled', price: '₹350' },
  { id: 'b4', customerName: 'Kavya S.', pickup: 'Guindy', dropoff: 'Tambaram', date: 'Yesterday, 8:45 PM', status: 'Completed', price: '₹620' },
];

export default function DashboardScreen() {
  const renderStatusBadge = (status: RecentBooking['status']) => {
    let bgColor = '#f3f4f6';
    let textColor = '#4b5563';

    if (status === 'Completed') {
      bgColor = '#d1fae5';
      textColor = '#059669';
    } else if (status === 'Pending') {
      bgColor = '#fef3c7';
      textColor = '#d97706';
    } else if (status === 'Cancelled') {
      bgColor = '#fee2e2';
      textColor = '#dc2626';
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
        <Text style={[styles.statusText, { color: textColor }]}>{status}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Zoho Top App Bar */}
      <View style={styles.zohoAppBar}>
        <View style={styles.appBarLeft}>
          <TouchableOpacity style={styles.iconButton}>
            <Menu size={22} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.appName}>Zoho Fleet</Text>
        </View>
        <View style={styles.appBarRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={20} color="#4b5563" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <UserCircle size={24} color="#4b5563" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.workspace} showsVerticalScrollIndicator={false}>
        
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Dashboard</Text>
          <Text style={styles.pageSubtitle}>Overview of your fleet operations</Text>
        </View>

        {/* Metric Cards Grid */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricsScroll}>
          {metrics.map((metric) => (
            <View key={metric.id} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricTitle}>{metric.title}</Text>
                <View style={[styles.iconBox, { backgroundColor: `${metric.iconColor}15` }]}>
                  <metric.IconComponent size={18} color={metric.iconColor} />
                </View>
              </View>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <View style={styles.trendRow}>
                {metric.trend === 'up' && <TrendingUp size={14} color="#059669" />}
                {metric.trend === 'down' && <TrendingDown size={14} color="#dc2626" />}
                {metric.trend === 'neutral' && <Activity size={14} color="#6b7280" />}
                <Text 
                  style={[
                    styles.trendText, 
                    metric.trend === 'up' && {color: '#059669'},
                    metric.trend === 'down' && {color: '#dc2626'}
                  ]}
                >
                  {metric.trendValue}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Recent Bookings Table (Zoho Data View) */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableHeaderTitle}>Recent Bookings</Text>
            <TouchableOpacity>
              <Text style={styles.tableActionText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tableContent}>
            {resentBookings.map((booking, index) => (
              <View 
                key={booking.id} 
                style={[
                  styles.tableRow, 
                  index === resentBookings.length - 1 && styles.tableRowLast
                ]}
              >
                <View style={styles.rowMainInfo}>
                  <Text style={styles.customerName}>{booking.customerName}</Text>
                  <Text style={styles.routeInfo}>
                    {booking.pickup} ➔ {booking.dropoff}
                  </Text>
                  <Text style={styles.dateInfo}>{booking.date}</Text>
                </View>
                
                <View style={styles.rowMetaInfo}>
                  <Text style={styles.priceInfo}>{booking.price}</Text>
                  {renderStatusBadge(booking.status)}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{height: 40}}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  zohoAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  appBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#015a9b', // Deep Zoho blue
    marginLeft: 12,
  },
  appBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  workspace: {
    flex: 1,
  },
  pageHeader: {
    padding: 24,
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  metricsScroll: {
    paddingLeft: 20,
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    width: 200,
    padding: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
    textTransform: 'uppercase',
  },
  iconBox: {
    padding: 6,
    borderRadius: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#fafafa',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  tableActionText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '500',
  },
  tableContent: {
    padding: 0,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  rowMainInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  routeInfo: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 4,
  },
  dateInfo: {
    fontSize: 12,
    color: '#9ca3af',
  },
  rowMetaInfo: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceInfo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
