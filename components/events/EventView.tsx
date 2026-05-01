'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { EventCard } from '@/components/events/EventCard';
import { EventFilter } from '@/components/events/EventFilter';
import { EventCategory, Event } from '@/lib/api/event';
import { useRouter } from 'next/navigation';

interface EventsViewProps {
  initialEvents: Event[];
  categories: EventCategory[];
}

export default function EventsView({ initialEvents, categories }: EventsViewProps) {
  const [selectedSlug, setSelectedSlug] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();


  const filteredEvents = initialEvents.filter((event) => {
    const matchesCategory = 
      selectedSlug === 'all' || 
      event.categories.some((cat) => cat.slug === selectedSlug);

   
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      event.title.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  
  const formatDateTime = (dateString: string) => {
    const dateObj = new Date(dateString);
    return {
      date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
      time: dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
  };

  const getEventType = (categories: EventCategory[]): any => {
    if (!categories || categories.length === 0) return 'gala';
    const slug = categories[0].slug;
    
    const validTypes = ['concert', 'sports', 'gala', 'festival', 'conference'];
    return validTypes.includes(slug) ? slug : 'gala'; 
  };

  return (
    <main className="min-h-screen bg-dark pt-20">
      {/* Hero Section */}
      <section className="bg-dark-charcoal py-16 border-b border-dark-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl mt-16 font-bold text-grey-pastel mb-4">
              Events in <span className="text-primary">Washington DC</span>
            </h1>
            <p className="text-xl text-grey-medium max-w-2xl mx-auto mb-8">
              Arrive in style to the city's premier concerts, games, and galas.
            </p>

            <div className="max-w-md mx-auto relative">
              <SearchIcon className="absolute left-3 top-3.5 w-5 h-5 text-grey-medium" />
              <input
                type="text"
                placeholder="Search events, venues, artists..."
                className="w-full pl-10 pr-4 py-3 rounded-full bg-dark border border-grey-muted text-grey-pastel focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Sidebar Filter */}
            <div className="lg:col-span-1">
              <EventFilter
                categories={categories}
                selectedType={selectedSlug}
                onSelect={setSelectedSlug}
              />
            </div>

            {/* Event Grid */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-grey-pastel">
                  Upcoming Events
                </h2>
                <span className="text-sm text-grey-medium">
                  {filteredEvents.length} events found
                </span>
              </div>

              {filteredEvents.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredEvents.map((event) => {
                    const { date, time } = formatDateTime(event.date);
                    return (
                      <EventCard
                        key={event.id}
                        title={event.title}
                        description={event.excerpt}
                        image={event.featured_image }
                        location={event.location}
                        date={date}
                        time={time}
                        type={getEventType(event.categories)}
                        onBook={() => router.push(`/`)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-dark-charcoal rounded-xl border border-dark-lighter">
                  <p className="text-grey-medium">
                    No events found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}