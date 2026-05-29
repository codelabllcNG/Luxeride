"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRideFlow } from '@/lib/hooks/useRideFlow';
import { VehicleQuoteList } from '@/components/booking/VehicleQuoteList';
import { ArrowLeft, MapPin, Navigation as NavIcon } from 'lucide-react';
import { Button } from '@/components/shared/Button';

export default function SelectVehiclePage() {
  const router = useRouter();
  const { quote, pickup, dropoff, setSelectedVehicle, setStep, serviceType, hours } = useRideFlow();

  // If no quote data, redirect back home
  if (!quote) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <button 
              onClick={() => router.push('/')}
              className="group flex items-center text-sm text-gray-400 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Change Locations
            </button>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Select your <span className="text-primary">{serviceType === 'hourly' ? 'Hourly Service' : 'Ride'}</span>
            </h1>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 min-w-[300px]">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10" />
                <p className="text-sm text-gray-300 truncate">{pickup?.address}</p>
             </div>
             {(serviceType !== 'hourly' || dropoff) && (
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-600 ring-4 ring-gray-600/10" />
                  <p className="text-sm text-gray-300 truncate">{dropoff?.address || 'No dropoff specified'}</p>
               </div>
             )}
             <div className="pt-2 mt-1 border-t border-white/5 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-gray-500">
                {serviceType === 'hourly' ? (
                  <>
                    <span>Duration: {hours} {hours === 1 ? 'Hour' : 'Hours'}</span>
                    <span>Service: Hourly</span>
                  </>
                ) : (
                  <>
                    <span>Distance: {quote.distance} {quote.distance_unit}</span>
                    <span>Time: ~25 mins</span>
                  </>
                )}
             </div>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="grid gap-6">
          <VehicleQuoteList 
            vehicles={quote.vehicles} 
            onSelect={(v) => {
              setSelectedVehicle(v);
              // Since the user wants a different page for available vehicles, 
              // we can decide whether to show the summary on a new page too.
              // For now, let's go to a summary page.
              router.push('/booking/confirm');
            }} 
          />
        </div>

        {/* Help footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Need a custom quote for events or large groups? 
            <Link href="/contact" className="text-primary ml-1 hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Add missing Link import if needed, but I'll use standard a tag if not imported.
import Link from 'next/link';
