import type { LucideIcon } from 'lucide-react-native';

export type AvailabilityStatus = 'Available Now' | 'Available in 5 mins' | 'Pre-book only' | 'Unavailable' | string;

/**
 * Core interface representing an auto rickshaw or travel vehicle in the fleet.
 */
export interface Vehicle {
  id: string;
  name: string;
  type: string;
  price: string;
  image: string;
  availability: AvailabilityStatus;
  rating?: number;
  driverName?: string;
  vehicleNumber?: string;
}

/**
 * Represents a service offering shown on the Explore page.
 * Uses LucideIcon components for type-safe icon rendering.
 */
export interface Feature {
  id: string;
  title: string;
  desc: string;
  IconComponent: LucideIcon;
  iconColor: string;
  iconSize: number;
}

/**
 * Standard user profile definition.
 */
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  isLoggedIn: boolean;
  avatarUrl?: string;
}

/**
 * Represents a popular destination route.
 */
export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  price: string;
  image: string;
}

/**
 * High-level metrics for dashboard cards.
 */
export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  IconComponent: LucideIcon;
  iconColor: string;
}

/**
 * Strict data shape for a recent booking table row.
 */
export interface RecentBooking {
  id: string;
  customerName: string;
  pickup: string;
  dropoff: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  price: string;
}
