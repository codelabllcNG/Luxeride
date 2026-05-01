
import { getEventCategories, getAllEvents, getEventsByCategorySlug } from '@/lib/api/event';
import EventsView from '@/components/events/EventView';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EventsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const categorySlug =
    typeof resolvedSearchParams.category === 'string'
      ? resolvedSearchParams.category
      : 'all';
  const categoriesData = await getEventCategories();

  let eventsData;
  if (categorySlug === 'all') {
    eventsData = getAllEvents();
  } else {
    eventsData = getEventsByCategorySlug(categorySlug);
  }
  const [categories, events] = await Promise.all([categoriesData, eventsData]);

  console.log('Fetched events:', events);

  return (
    <EventsView
      initialEvents={events || []}
      categories={categories || []}
    />
  );
}