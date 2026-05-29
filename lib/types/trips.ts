
export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface VehicleQuote {
  page_id: number;
  title: string;
  estimated_price: number;
  image_url: string;
  subheading?: string;
  capacity?: string;
  rating?: string;
  driver_distance?: number;
  original_price?: number;
  discount_amount?: number;
  currency?: string;
  hourly_rate?: number;
  hours?: number;
}

export interface TripQuote {
  status: string;
  message?: string;
  distance: number;
  distance_unit: string;
  currency: string;
  vehicles: VehicleQuote[];
}

export interface Trip {
  id: string | number;
  status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
  pickup_location: string;
  dropoff_location: string;
  estimated_price: number;
  currency: string;
  distance: number;
  pickup_lat?: number;
  pickup_lng?: number;
  dropoff_lat?: number;
  dropoff_lng?: number;
  driver?: {
    id: number;
    name: string;
    phone: string;
    email?: string;
    avatar: string;
    car_model?: string;
    license_plate?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
  customer?: {
    id: number;
    name: string;
    phone: string;
    email: string;
    avatar?: string;
  };
  created_at: string;
  payment_status?: 'paid' | 'unpaid' | 'pending' | 'authorized';
}
