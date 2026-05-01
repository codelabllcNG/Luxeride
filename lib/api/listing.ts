
export interface VehicleListingPayload {
  customer_name: string;
  email: string;
  phone_number: string;
  vehicle_type: string;
  year: string;
  vehicle_model: string;
  vehicle_make: string;
  message: string;
  capacity: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export const submitVehicleListing = async (payload: VehicleListingPayload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit listing');
    }

    return await response.json();
  } catch (error) {
    console.error('Listing Error:', error);
    throw error;
  }
};