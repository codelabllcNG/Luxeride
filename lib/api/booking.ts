"use server"

import { cookies } from "next/headers";
export interface BookingPayload {
  service_id: string;
  customer_name: string;
  email: string;
  phone: string;
  service_type: string;
  service_name: string;
  service_description: string;
  pickup_date: string;
  pickup_time: string; 
  pickup_location: string;
  dropoff_location: string;
  passengers: string;
  vehicle_type: string;

}
export interface Booking {
  id: number;
  title: string;
  date_created: string;
  status: string;
  customer_name: string;
  email: string;
  service_type: string;
  pickup_location: string;
  dropoff_location: string;
  passengers: string;
  pickup_date: string;
  pickup_time: string;
}
export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createBooking(payload: BookingPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to create booking');
    }

    return data;
  } catch (error) {
    console.error('Booking API Error:', error);
    throw error;
  }
}


export async function getBookingByEmail(email: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${API_BASE_URL}/bookings/user/${email}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      return { success: false, error: `API Error: ${res.statusText}` };
    }
    const data = await res.json();
    const bookings: Booking[] = Array.isArray(data.data) ? data.data : [];
    return { success: true, data: bookings };

  } catch (error) {
    console.error("Failed to get booking: ", error);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function getLocationSuggestion(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const params = new URLSearchParams({ q: query, limit: '5' });
    const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`);
    
    if (!res.ok) throw new Error('Failed to fetch location suggestions');

    const data = await res.json();
    

    const suggestions = data.features.map((f: any) => {
      const { name, city, country, state } = f.properties;
      const parts = [name, city, state, country].filter(Boolean); 
      return parts.join(', ');
    });

    return suggestions;

  } catch (err) {
    console.error("Location Fetch Error:", err);
    return [];
  }
}