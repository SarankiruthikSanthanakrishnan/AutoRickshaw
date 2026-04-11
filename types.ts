import type { LucideIcon } from 'lucide-react-native';

export type VehicleCategory = 'Auto' | 'Van';

export interface DriverData {
  id: string;
  name: string;
  vehicleNumber: string;
  phoneNumber: string;
  category: VehicleCategory;
  subCategory?: string; // Auto, Share Auto, Van
  image: string;
  driverImage: string;
  rating: number;
  price: string;
}

export interface Driver {
  id: string;
  name: string;
  vehicleType: string;
  phoneNumber: string;
}
