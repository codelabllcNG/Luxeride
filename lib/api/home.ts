import { FeaturedVehicle } from "@/components/home/MarketplaceFeatured";
import { WhyChooseUsFeature } from "@/components/home/TrustSection";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export type HomeData = {
  hero: {
    background_image: string;
  };
  services: {
    limo_card: { title: string; description: string }[];
    logistics_card: { title: string; description: string }[];
  }
  featured_vehicles: FeaturedVehicle[] | null;
  mobility_equipment: any[];
  moving_services: any[];
  why_choose_us: {
    features: WhyChooseUsFeature[];
  };
};

export type GetHomeDataResponse =
  | {
    status: "success";
    message: string;
    data: HomeData;
  }
  | {
    status: "fail";
    message: string;
  };


export async function getHomeData(): Promise<GetHomeDataResponse> {
  const res = await fetch(`${API_BASE_URL}/get-home-data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      status: "fail",
      message: data.message || "Failed to retrieve home data",
    };
  }

  return data;
}