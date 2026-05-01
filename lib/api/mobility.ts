
export interface FeatureItem {
  title: string;
  description: string;
}

export interface MobilityPageData {
  hero: {
    heading: string;
    subheading: string;
    background_image: string;
  };
  why_choose_us: FeatureItem[];
}

export interface PageDataResponse {
  status: string;
  message: string;
  data: MobilityPageData;
}

//  Equipment List ---
export interface EquipmentFeature {
  title: string;
}

export interface EquipmentItem {
  page_id: number;
  title: string;
  description: string;
  image_url: string;
  price_per_day: string;
  price_per_week: string;
  features: EquipmentFeature[];
  link: string;
}

export interface EquipmentListResponse {
  status: string;
  message: string;
  data: EquipmentItem[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getMobilityPageData(): Promise<MobilityPageData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/get-mobility-page-data`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json: PageDataResponse = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching page data:", error);
    return null;
  }
}


export async function getMobilityEquipment(): Promise<EquipmentItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/get-all-mobility-equipment`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json: EquipmentListResponse = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return [];
  }
}