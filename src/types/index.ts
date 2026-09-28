export type VehicleCategory = 'SUV' | 'Compacte' | 'Citadine' | 'Berline' | 'Crossover';

export type FuelType = 'Essence' | 'Diesel' | 'Hybride';

export type TransmissionType = 'Automatique' | 'Manuelle';

export interface VehicleTechnicalSpecs {
  engine?: string;
  engine_displacement?: string;
  cylinders?: number;
  power_hp?: number;
  power_kw?: number;
  torque_nm?: number;
  fuel_type?: FuelType;
  transmission?: TransmissionType;
  transmission_gears?: number;
  drive_type?: string;
}

export interface VehiclePerformanceSpecs {
  top_speed_kmh?: number;
  acceleration_0_100?: number;
  combined_consumption?: string;
}

export interface VehicleDimensionsSpecs {
  length_mm?: number;
  width_mm?: number;
  height_mm?: number;
  wheelbase_mm?: number;
  ground_clearance_mm?: number;
  seats?: number;
  doors?: number;
  luggage_capacity?: number;
  fuel_tank_capacity?: number;
}

export interface VehicleComfortSpecs {
  air_conditioning?: boolean;
  climate_control?: boolean | string;
  parking_sensors?: boolean | string;
  rear_camera?: boolean;
  cruise_control?: boolean | string;
  bluetooth?: boolean;
  apple_carplay?: boolean;
  android_auto?: boolean;
  usb?: boolean | string;
  navigation?: boolean;
  keyless_entry?: boolean;
  push_start?: boolean;
  sunroof?: boolean | string;
}

export interface VehicleSafetySpecs {
  abs?: boolean;
  esp?: boolean;
  airbags?: number | string;
  isofix?: boolean;
  tpms?: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  slug: string;
  brand: string;
  model: string;
  generation?: string;
  model_year?: number;
  year: number; // for backward compatibility
  trim?: string;
  category: VehicleCategory;
  body_type?: string;

  image: string;
  gallery?: string[];
  description: string;

  daily_price: number; // in DA
  weekly_price?: number;
  monthly_price?: number;
  currency: string;

  // Primary flat fields
  fuel_type: FuelType;
  engine?: string;
  engine_displacement?: string;
  cylinders?: number;
  power_hp?: number;
  power_kw?: number;
  torque_nm?: number;

  transmission: TransmissionType;
  transmission_gears?: number;
  drive_type?: string;

  seats: number;
  doors: number;
  luggage: number; // in suitcases
  luggage_capacity?: number; // in liters
  fuel_tank_capacity?: number; // in liters

  length_mm?: number;
  width_mm?: number;
  height_mm?: number;
  wheelbase_mm?: number;
  ground_clearance_mm?: number;

  top_speed_kmh?: number;
  acceleration_0_100?: number; // in seconds
  combined_consumption?: string; // e.g. "5.4 L / 100 km"

  // Comfort & Equipment flat fields
  air_conditioning?: boolean;
  climate_control?: boolean | string;
  parking_sensors?: boolean | string;
  rear_camera?: boolean;
  cruise_control?: boolean | string;
  bluetooth?: boolean;
  apple_carplay?: boolean;
  android_auto?: boolean;
  usb?: boolean | string;
  navigation?: boolean;
  keyless_entry?: boolean;
  push_start?: boolean;
  sunroof?: boolean | string;

  // Safety flat fields
  abs?: boolean;
  esp?: boolean;
  airbags?: number | string;
  isofix?: boolean;
  tpms?: boolean;

  // Optional nested specification objects for grouped structures
  technical?: VehicleTechnicalSpecs;
  dimensions?: VehicleDimensionsSpecs;
  performance?: VehiclePerformanceSpecs;
  comfort?: VehicleComfortSpecs;
  safety?: VehicleSafetySpecs;

  featured: boolean;
  available: boolean;
  active: boolean;
  sort_order: number;
  is_verified_price: boolean; // Flag indicating if price is confirmed or indicative starting price
  notes?: string;

  specification_source?: string;
  specification_verified?: boolean;
  last_verified_at?: string;

  created_at?: string;
  updated_at?: string;
}

export type BookingStatus = 'new' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  vehicle_id: string;
  vehicle_name: string;
  pickup_location: string;
  pickup_date: string; // YYYY-MM-DD
  pickup_time: string; // HH:mm
  return_location: string;
  return_date: string; // YYYY-MM-DD
  return_time: string; // HH:mm
  airport_pickup: boolean;
  flight_number?: string;
  driver_option: boolean;
  message?: string;
  status: BookingStatus;
  admin_notes?: string;
  total_days?: number;
  estimated_price?: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessSettings {
  business_name: string;
  brand_tagline: string;
  brand_subtitle: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  primary_phone: string;
  secondary_phone: string;
  alternative_phones: string[];
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  opening_hours: string;
  airport_service: boolean;
  airport_free_delivery: boolean;
  currency: string;
  google_rating: number;
  google_reviews_count: number;
  google_maps_url: string;
  // Conflict / data validation tracking
  unverified_notes: string[];
  updated_at: string;
}

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  source: 'Google' | 'Facebook' | 'Instagram' | 'Direct';
  source_url?: string;
  date: string;
  published: boolean;
  avatar?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  full_desc: string;
  icon: string;
  active: boolean;
  sort_order: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  published: boolean;
  sort_order: number;
}

export interface AnalyticsEvent {
  event: string;
  timestamp: string;
  meta?: Record<string, unknown>;
}

export type Language = 'fr' | 'ar' | 'en';
