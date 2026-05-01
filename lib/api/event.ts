
export interface EventCategory {
  id: string | number;
  name: string;
  slug: string;
  count?: number;
  description?: string;
}

export type Event = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  categories: EventCategory[];
  location: string;
  date: string;
};


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not defined");
}


export interface EventCategory {
  id: string | number;
  name: string;
  slug: string;
  count?: number;
  description?: string;
}

export async function getEventCategories(): Promise<EventCategory[]> {
  const res = await fetch(`${API_BASE_URL}/get-event-categories`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch event categories');
  }

  const json = await res.json();
  const apiCategories = json.data || [];

  const allOption: EventCategory = {
    id: 'all',
    name: 'All Events',
    slug: 'all',
    count: 0
  };

  return [allOption, ...apiCategories];
}

export async function getAllEvents(): Promise<Event[]> {
  const res = await fetch(`${API_BASE_URL}/get-all-events`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch events');
  }


  const json = await res.json();
  return json.data;
}

export async function getEventsByCategorySlug(
  slug: string
): Promise<Event[]> {
  const res = await fetch(
    `${API_BASE_URL}/get-events-by-category/${slug}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch events by category');
  }

  const json = await res.json();
  return json.data;
}