
export interface LocationSuggestion {
  address: string;
  lat: number;
  lng: number;
}

export async function fetchLocationSuggestions(query: string): Promise<LocationSuggestion[]> {
  if (!query || query.length < 3) return [];

  try {
    const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&countrycodes=us&limit=5&addressdetails=1`;

    const res = await fetch(endpoint, {
      headers: {
        'User-Agent': 'Luxeride/1.0'
      }
    });

    if (!res.ok) return [];

    const data: any[] = await res.json();

    return data.map((item) => ({
      address: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    }));
    
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<LocationSuggestion | null> {
  try {
    const endpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;

    const res = await fetch(endpoint, {
      headers: {
        'User-Agent': 'Luxeride/1.0'
      }
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data || !data.display_name) return null;

    return {
      address: data.display_name,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon)
    };
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
}
