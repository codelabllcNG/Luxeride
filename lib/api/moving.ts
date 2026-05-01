// types/moving.ts

export interface ServiceCard {
  title: string;
  description: string;
}

export interface ServiceSection {
  heading: string;
  subheading: string;
  cards: ServiceCard[];
}

export interface MovingPageData {
  hero: {
    heading: string;
    subheading: string;
    background_image: string;
  };
  our_services: ServiceSection[];
}

export interface MovingApiResponse {
  status: string;
  message: string;
  data: MovingPageData;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMovingPageData(): Promise<MovingPageData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/get-moving-page-data`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch moving data");
    }

    const json: MovingApiResponse = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching moving page data:", error);
    return null;
  }
}