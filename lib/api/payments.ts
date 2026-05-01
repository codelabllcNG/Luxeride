
"use server"

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export async function createPaymentIntent(trip_id: string, save_card: boolean = false, payment_method_id?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/payments/create-intent`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ 
        trip_id, 
        save_card,
        ...(payment_method_id && { payment_method_id })
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { status: "fail", message: data.message || "Failed to create payment intent" };
    }

    return { 
      status: "success", 
      client_secret: data.client_secret,
      payment_intent_id: data.payment_intent_id,
      publishable_key: data.publishable_key
    };
  } catch (error) {
    return { status: "fail", message: "Network error occurred while creating payment intent" };
  }
}

export async function getSavedCards() {
  try {
    const res = await fetch(`${API_BASE_URL}/payments/cards`, {
      method: "GET",
      headers: await getAuthHeaders(),
      cache: "no-store"
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      return { status: "fail", message: data.message || "Failed to fetch saved cards" };
    }

    return { status: "success", data: data.data };
  } catch (error) {
    return { status: "fail", message: "Failed to fetch saved cards" };
  }
}

export async function deleteSavedCard(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/payments/cards/${id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      return { status: "fail", message: data.message || "Failed to delete card" };
    }

    return { status: "success", message: data.message };
  } catch (error) {
    return { status: "fail", message: "Failed to delete card" };
  }
}

export async function getSetupIntent() {
  try {
    const res = await fetch(`${API_BASE_URL}/payments/setup-intent`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      return { status: "fail", message: data.message || "Failed to initialize card setup" };
    }

    return { 
      status: "success", 
      client_secret: data.client_secret,
      publishable_key: data.publishable_key
    };
  } catch (error) {
    return { status: "fail", message: "Failed to initialize card setup" };
  }
}

export async function verifyPayment(payment_intent_id: string, trip_id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ payment_intent_id, trip_id }),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      return { status: "fail", message: data.message || "Payment verification failed" };
    }

    return { status: "success" };
  } catch (error) {
    return { status: "fail", message: "Network error occurred during payment verification" };
  }
}

export async function confirmTrip(trip_id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/payments/confirm-trip`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ trip_id }),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      return { status: "fail", message: data.message || "Failed to confirm trip" };
    }

    return { status: "success" };
  } catch (error) {
    return { status: "fail", message: "Failed to confirm trip" };
  }
}
