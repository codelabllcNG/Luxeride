
"use server"

import { cookies } from "next/headers";
import { Trip, TripQuote } from "../types/trips";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export async function getTripQuote(payload: {
  service_type?: "ride" | "hourly";
  pickup_location: string;
  dropoff_location?: string;
  pickup_lat: number;
  pickup_lng: number;
  dropoff_lat?: number;
  dropoff_lng?: number;
  hours?: number;
  promo_code?: string;
}): Promise<{ status: "success"; data: TripQuote } | { status: "fail"; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/trips/get-quote?debug=true`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Trip Quote Response:", data);
    
    if (!res.ok || data.status !== "success") {
      return { status: "fail", message: data.message || "Failed to get quote" };
    }

    return { status: "success", data: data };
  } catch (error) {
    return { status: "fail", message: "Network error occurred while fetching quote" };
  }
}

export async function validatePromo(promo_code: string, base_price: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/trips/validate-promo`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ promo_code, base_price }),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      return { status: "fail", message: data.message || "Invalid promo code" };
    }

    return { status: "success", data: data };
  } catch (error) {
    return { status: "fail", message: "Failed to validate promo code" };
  }
}

export async function requestTrip(payload: {
  pickup_location: string;
  dropoff_location?: string;
  pickup_lat: number;
  pickup_lng: number;
  dropoff_lat?: number;
  dropoff_lng?: number;
  vehicle_id: string;
  estimated_price: number;
  service_type: "ride" | "delivery" | "hourly";
  hours?: number;
  pickup_datetime?: string;
  passengers?: number;
  notes?: string;
  receiver_name?: string;
  receiver_phone?: string;
  package_type?: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/trips/request`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      return { status: "fail", message: data.message || "Failed to request trip" };
    }

    return { status: "success", data: data };
  } catch (error) {
    return { status: "fail", message: "Network error occurred while requesting trip" };
  }
}

export async function getOngoingTrip() {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/trips/ongoing`, {
      method: "GET",
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    const data = await res.json();
    console.log("=== Ongoing Trip API Data ===", data);
    if (!res.ok || data.status !== "success") {
      return { status: "fail", message: data.message || "No ongoing trip" };
    }

    return { status: "success", trip: data.data };
  } catch (error) {
    return { status: "fail", message: "Failed to fetch ongoing trip" };
  }
}

export async function cancelTrip(tripId: string, reason: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/trips/${tripId}/cancel`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      return { status: "fail", message: data.message || "Failed to cancel trip" };
    }

    return { status: "success" };
  } catch (error) {
    return { status: "fail", message: "Failed to cancel trip" };
  }
}

export async function sendChatMessage(trip_id: string | number, text: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/chats/send`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ trip_id: Number(trip_id), text }),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      return { status: "fail", message: data.message || "Failed to send message" };
    }

    return { status: "success", data };
  } catch (error) {
    return { status: "fail", message: "Failed to send message" };
  }
}

export async function getChatMessageHistory(tripId: string | number) {
  try {
    const res = await fetch(`${API_BASE_URL}/chats/trip/${tripId}/messages`, {
      method: "GET",
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      return { status: "fail", message: data.message || "Failed to fetch chat history" };
    }

    return { status: "success", data: data.data };
  } catch (error) {
    return { status: "fail", message: "Failed to fetch chat history" };
  }
}
