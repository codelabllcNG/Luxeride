const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Vehicle {
  page_id: number;
  title: string | null;
  subheading: string | null;
  image_url: string;
  image_title: string;
  price: string | null;
  capacity: string | null;
  rating: string;
  link: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: {
    vehicles: Vehicle[];
  };
}

export async function getAllVehicles() {
  if (!API_BASE_URL) {
    console.warn("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/get-all-vehicles`, {
      method: 'GET',
      headers: { "Content-Type": "application/json" },
      cache: 'no-store'
    });

    if (!res.ok) {
      return { success: false, error: `API Error: ${res.statusText}`, data: [] };
    }

    const json: ApiResponse = await res.json();
    const rawVehicles = json.data?.vehicles || [];
    const filteredVehicles = rawVehicles.filter(v => v.title !== null);

    return {
      success: true,
      data: filteredVehicles
    };

  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    return { success: false, error: "Internal Server Error", data: [] };
  }
}

// services/vehicleService.ts

export async function getVehicleById(id: string | string[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/get-vehicle/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache the data for 60 seconds to improve speed
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return null;
  }
}