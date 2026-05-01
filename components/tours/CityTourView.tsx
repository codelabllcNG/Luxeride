'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, Star, Users, MapPin } from 'lucide-react';
import { TestimonialCard } from '@/components/tours/TestimonialCard';
import { CityToursData, CityTour } from '@/lib/api/tours';

const ITEMS_PER_PAGE = 6;

interface CityToursViewProps {
  data: CityToursData;
}

export default function CityToursView({ data }: CityToursViewProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Destructure data from props
  const { tour_companies, city_tours } = data;

  // Pagination Logic
  const totalPages = Math.ceil(city_tours.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTours = city_tours.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('tour-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTourClick = (id: number) => {
    router.push(`/city-tours/${id}`);
  };

  return (
    <main className="min-h-screen bg-dark pt-36">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-dark-charcoal">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-10" />
          <Image 
            src="https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=1920&h=1080&fit=crop" 
            alt="Washington DC Monuments" 
            fill
            priority
            className="object-cover opacity-50"
            sizes="100vw"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="max-w-2xl"
          >
            <h1 className="text-5xl font-bold text-grey-pastel mb-6 leading-tight">
              Discover DC in <span className="text-primary">Luxury</span>
            </h1>
            <p className="text-xl text-grey-pastel mb-8 font-light">
              Experience the capital's historic landmarks from the comfort of premium vehicles. 
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- TOUR GRID SECTION --- */}
      <section id="tour-grid" className="py-20 bg-dark scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header (Dynamic from API) */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-grey-pastel mb-4">
              {tour_companies.heading}
            </h2>
            <p className="text-grey-medium max-w-2xl mx-auto">
              {tour_companies.subheading}
            </p>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPage} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              transition={{ duration: 0.3 }} 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {currentTours.map((tour, index) => (
                <TourCard 
                  key={tour.page_id} 
                  tour={tour} 
                  index={index} 
                  onClick={() => handleTourClick(tour.page_id)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-12">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1} 
                className={`p-2 rounded-lg border transition-all ${currentPage === 1 ? 'border-dark-lighter text-grey-muted cursor-not-allowed' : 'border-grey-muted text-grey-pastel hover:border-primary hover:text-primary'}`}
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page} 
                  onClick={() => handlePageChange(page)} 
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === page ? 'bg-primary text-black font-bold' : 'bg-dark-lighter text-grey-pastel hover:bg-dark-lighter/80'}`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className={`p-2 rounded-lg border transition-all ${currentPage === totalPages ? 'border-dark-lighter text-grey-muted cursor-not-allowed' : 'border-grey-muted text-grey-pastel hover:border-primary hover:text-primary'}`}
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* --- TESTIMONIALS (Static for now, can be made dynamic later) --- */}
      <section className="py-16 bg-dark-charcoal border-t border-dark-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-grey-pastel mb-12 text-center">
            Guest Experiences
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Sarah Jenkins" 
              location="New York, NY" 
              rating={5} 
              quote="The night tour of the monuments was breathtaking. Our driver knew all the best photo spots!" 
            />
            <TestimonialCard 
              name="David Chen" 
              location="San Francisco, CA" 
              rating={5} 
              quote="Booked the Sprinter for our family reunion. Comfortable, spacious, and excellent service." 
            />
            <TestimonialCard 
              name="Elena Rodriguez" 
              location="Miami, FL" 
              rating={4} 
              quote="Great way to see the city without all the walking. The SUV was pristine and very comfortable." 
            />
          </div>
        </div>
      </section>
    </main>
  );
}

// Sub-component for individual cards
function TourCard({ tour, index, onClick }: { tour: CityTour, index: number, onClick: () => void }) {
  // Safe fallback for subheading if API returns empty string
  const description = tour.subheading || "Experience the best of DC with this exclusive tour package.";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.1 }}
      className="group bg-dark-charcoal rounded-xl overflow-hidden border border-dark-lighter hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="relative h-56 overflow-hidden">
        <Image 
          src={tour.image_url} 
          alt={tour.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
          <Star className="w-3 h-3 text-primary fill-primary" />
          <span className="text-grey-pastel text-xs font-bold">{tour.rating}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-grey-pastel mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {tour.title}
        </h3>
        <p className="text-grey-medium text-sm mb-6 line-clamp-2 flex-grow">
          {description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-dark-lighter">
          <div className="flex items-center gap-4 text-xs text-grey-medium">
             <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-primary" />
                <span>Max {tour.capacity}</span>
             </div>
             <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary" />
                <span>DC Area</span>
             </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-primary font-bold text-lg">${tour.price}</span>
            <span className="text-grey-dark text-xs">/person</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}