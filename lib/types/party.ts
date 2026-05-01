// types/party.ts

export interface PartyBusSummary {
  page_id: number;
  title: string;
  description: string;
  image_url: string | boolean; 
  image_title?: string;
  features: string;

  rating: string;
}

export interface PartyBusDetail {
  id: number;
  title: string;
  custom_title: string;
  short_description: string;
  image_url: string | boolean;
  author: string;
  date: string;
  category: string;
  link: string;
  content: string;
}