export type Language = 'en' | 'te' | 'hi' | 'ml' | 'kn';

export interface LanguageOption {
  code: Language;
  name: string;
  native: string;
  scriptBadge: string;
}

export type PlaceType = 'Home' | 'Office' | 'Workspace';

export type PickupStatus = 
  | 'Scheduled'
  | 'Collector Assigned'
  | 'On The Way'
  | 'Arrived'
  | 'Collected'
  | 'Weight Verified'
  | 'Payment Sent'
  | 'Completed';

export interface User {
  id: string;
  name: string;
  emailOrPhone: string;
  walletBalance: number;
  totalRecycledKg: number;
  co2SavedKg: number;
  itemsRecycledCount: number;
  impactTier: 'Eco Starter' | 'Green Guardian' | 'Circular Champion' | 'Planet Hero';
}

export interface Address {
  id: string;
  userId: string;
  line1: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  label: 'Home' | 'Office' | 'Workspace' | 'Other';
  isDefault?: boolean;
}

export interface ScannedItem {
  id: string;
  userId?: string;
  imageUrl?: string;
  objectName: string;
  category: 'Plastic' | 'Paper & Cardboard' | 'Metal' | 'Glass' | 'E-Waste' | 'Other';
  material: string;
  isRecyclable: boolean;
  confidence: number;
  quantity: number;
  estimatedWeightRangeKg: string;
  estimatedWeightKg: number;
  estimatedPricePerKg: number;
  estimatedPayout: number;
  reasonIfNotRecyclable?: string;
  recyclingTip?: string;
  createdAt: string;
}

export interface Collector {
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  totalPickups: number;
  photoUrl: string;
}

export interface Pickup {
  id: string;
  userId: string;
  addressId: string;
  address: Address;
  items: ScannedItem[];
  pickupDate: string;
  timeSlot: string;
  placeType: PlaceType;
  status: PickupStatus;
  finalVerifiedWeight: number;
  payoutAmount: number;
  collector: Collector;
  collectorCoords: { lat: number; lng: number };
  currentEtaMinutes: number;
  currentDistanceKm: number;
  createdAt: string;
  notes?: string;
  stepperHistory: {
    status: PickupStatus;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface WalletTransaction {
  id: string;
  pickupId?: string;
  type: 'credit' | 'withdrawal';
  amount: number;
  description: string;
  timestamp: string;
  method?: string;
  referenceId: string;
  status: 'Completed' | 'Pending';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'pickup' | 'wallet' | 'rate' | 'tip';
}
