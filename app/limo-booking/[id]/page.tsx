'use client';

import React, { use, useEffect, useState } from 'react';
import { 
  StarIcon, 
  UsersIcon, 
  ArrowLeftIcon, 
  ShieldCheckIcon,
  CheckIcon, 
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { BookingModal } from '@/components/marketplace/BookingModal';
import { ApiVehicle } from '@/components/marketplace/VehicleCard';
import { ImageCarousel } from '@/components/listing/ImageCarousel';
import { getVehicleById } from '@/lib/api/vehicle';
import { useParams } from 'next/navigation';
import { useBookingStore } from '@/lib/store/useBookingStore';

export default function VehiclePage() {
  const { setModalOpen } = useBookingStore();
  const [vehicleData, setVehicleData] = useState<ApiVehicle | null>(null);
  const params = useParams();
  const { id } = params as { id: string };
  useEffect(() => {
    // Simulating data fetch
    const fetchData = async () => {
      const data = await getVehicleById(id);
      setVehicleData({
        page_id: Number(data.page_id),
        title: data.title,
        subheading: data.subheading,
        image_url: data.image_url,
        image_title: data.image_title,
        price: data.price,
        capacity: data.capacity,
        rating: data.rating,
        link: data.link,
        description: data.description,
        features: data.features
      });
    } ;
    fetchData();
  }, []);

  if (!vehicleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark text-grey-pastel">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  const vehicle = vehicleData;
  const displayPrice = (!vehicle.price || parseInt(vehicle.price) <= 0)
    ? "Contact for Quote"
    : `$${vehicle.price} / hr`;

  const modalData: ApiVehicle = {
    page_id: Number(vehicle.page_id),
    title: vehicle.title,
    subheading: vehicle.subheading,
    image_url: vehicle.image_url,
    image_title: vehicle.image_title,
    price: vehicle.price,
    capacity: vehicle.capacity,
    rating: vehicle.rating,
    link: vehicle.link
  };


  const vehicleImages = [
    vehicle.image_url,
     // Side profile
  ];

  return (
    <main className="min-h-screen bg-dark text-grey-pastel pt-24 pb-12">
      
      {/* 1. TOP NAVIGATION */}
      <div className="max-w-6xl mt-18 mx-auto px-4 sm:px-6 mb-8">
        <Link 
          href="/limo-booking" 
          className="inline-flex items-center text-sm text-grey-medium hover:text-grey-pastel transition-colors group"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to booking
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* 2. HEADER SECTION */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary tracking-wider uppercase">
              {vehicle.title}
            </span>
            <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full">
              <StarIcon className="w-3 h-3 text-primary fill-primary" />
              <span className="text-xs font-bold text-grey-pastel">{vehicle.rating}</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-grey-pastel mb-2">
            {vehicle.subheading}
          </h1>
          <p className="text-grey-medium flex items-center gap-2 text-sm">
            <ShieldCheckIcon className="w-4 h-4 text-primary" />
            Premium Fleet Collection
          </p>
        </div>

        {/* 3. MAIN CONTENT GRID */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Carousel & Info (Takes up 2/3 space) */}
          <div className="md:col-span-2 space-y-10">
            
            {/* --- CAROUSEL INTEGRATION --- */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/5">
              <ImageCarousel images={vehicleImages} />
            </div>

            {/* Simple Description */}
            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold text-grey-pastel mb-3">Vehicle Overview</h3>
              <p className="text-grey-medium leading-relaxed">
                {vehicle.description || "No description available for this vehicle at the moment. Please contact us for more details."}
              </p>
            </div>

            {/* Highlights List */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
              <h4 className="text-sm font-semibold text-grey-pastel mb-4 uppercase tracking-wide">Included Features</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicle.features?.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-grey-medium">
                    <CheckIcon className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Booking Card (Takes up 1/3 space) */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="bg-dark-charcoal border border-white/10 rounded-2xl p-6 shadow-xl">
                
                <div className="mb-6">
                  <p className="text-sm text-grey-medium mb-1">Hourly Rate</p>
                  <div className="text-2xl font-bold text-grey-pastel text-primary">
                    {displayPrice}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-sm text-grey-medium flex items-center gap-2">
                      <UsersIcon className="w-4 h-4" /> Capacity
                    </span>
                    <span className="text-sm font-medium text-grey-pastel">{vehicle.capacity} Passengers</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-sm text-grey-medium">Condition</span>
                    <span className="text-sm font-medium text-grey-pastel">Excellent</span>
                  </div>
                </div>

                <button 
                  onClick={() => setModalOpen(true)}
                  className="w-full bg-primary hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                >
                  Book Now
                </button>
                
                <p className="text-xs text-center text-grey-dark mt-4">
                  No payment required to request a quote.
                </p>

              </div>
            </div>
          </div>

        </div>
      </div>


    </main>
  );
}