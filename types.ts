export type VehicleCategory = 'Auto' | 'Van';

export interface DriverData {
  status: any;
  id: string;
  name: string;
  vehicleNumber: string;
  phoneNumber: string;
  category: VehicleCategory;
  subCategory?: string;
  vehicleType?: string; // Auto, Share Auto, Van
  image: string;
  driverImage: string;
  cloudPublicId?: string; // Stored from Cloudinary response
  rating: number;
  price: string;
}

export interface Driver {
  id: string;
  name: string;
  vehicleType: string;
  phoneNumber: string;
}

export interface BannerData {
  id: string;
  imageUrl: string;
  storagePath: string; // To delete from Firebase Storage later
  createdAt: number;
}
