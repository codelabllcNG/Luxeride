'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, CarIcon } from 'lucide-react';
import { VehicleCard } from '@/components/marketplace/VehicleCard';
import { PageLoader } from '@/components/shared/PageLoader';
import { getAllVehicles, Vehicle } from '@/lib/api/vehicle';

export default function LimoBookingPage() {
  // --- API STATE ---
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- UI STATE ---
  const [filterCategory, setFilterCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // --- FETCH DATA ---
  useEffect(() => {
    async function fetchFleet() {
      try {
        setIsLoading(true);
        const response = await getAllVehicles();
        if (response.success) {
          setVehicles(response.data);
        } else {
          setError(response.error || 'Failed to load fleet');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    fetchFleet();
  }, []);

  const handleOpenBooking = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  // --- FILTERING LOGIC ---
  const cleanedFleet = useMemo(() => {
    return vehicles
      .filter(v => v.title && v.image_url) // Ensure data is renderable
      .filter(v => filterCategory === 'All' || v.title === filterCategory);
  }, [vehicles, filterCategory]);

  const categories = useMemo(() => {
    const uniqueTitles = Array.from(new Set(vehicles.map(v => v.title).filter(Boolean)));
    return ['All', ...uniqueTitles] as string[];
  }, [vehicles]);



  return (
    <main className="min-h-screen bg-dark">
      
      {/* HERO SECTION */}
      <section className="relative pt-48 pb-16 md:pt-52 lg:pt-60 lg:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
              <StarIcon className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-grey-pastel tracking-wider uppercase">Premium Fleet Selection</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-grey-pastel mb-6 tracking-tight">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Experience</span>
            </h1>
            <p className="text-lg text-grey-medium max-w-2xl mx-auto leading-relaxed">
              Explore our exclusive collection of luxury vehicles. 
              Meticulously maintained for your comfort and style.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center mb-8">
              {error}
            </div>
          )}

          {/* Filter Tabs */}
          {/* {!error && categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${
                    filterCategory === cat 
                      ? 'bg-primary text-black font-semibold shadow-lg shadow-primary/20' 
                      : 'bg-dark-charcoal text-grey-medium hover:bg-dark-lighter hover:text-grey-pastel'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )} */}

          {/* Vehicle Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cleanedFleet.map((vehicle, index) => (
              <VehicleCard 
                key={vehicle.page_id} 
                vehicle={vehicle} 
                index={index} 
                onBook={() => handleOpenBooking(vehicle)}
              />
            ))}
          </div>

          {/* Empty State */}
          {cleanedFleet.length === 0 && !isLoading && (
            <div className="text-center py-20 bg-dark-charcoal/50 rounded-2xl border border-dashed border-white/10">
              <CarIcon className="w-12 h-12 text-grey-medium mx-auto mb-4 opacity-50" />
              <p className="text-grey-medium">No vehicles found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}