"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRideFlow } from '@/lib/hooks/useRideFlow';
import { ArrowLeft, MapPin, Receipt, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import { Button } from '@/components/shared/Button';

export default function ConfirmBookingPage() {
  const router = useRouter();
  const { pickup, dropoff, selectedVehicle, bookRide, isLoading } = useRideFlow();

  if (!selectedVehicle || !pickup || !dropoff) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  const handleBook = async () => {
    await bookRide(selectedVehicle);
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <button 
              onClick={() => router.push('/booking/select-vehicle')}
              className="group flex items-center text-sm text-gray-400 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Vehicle Selection
            </button>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Confirm your <span className="text-primary">Booking</span>
            </h1>
          </div>

          {/* Summary Card */}
          <div className="bg-dark-charcoal/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 space-y-8">
              {/* Route */}
              <div className="relative space-y-6">
                <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary to-gray-700 dashed-border" />
                
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/10" />
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Pickup Location</p>
                  <p className="text-white font-medium">{pickup.address}</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-gray-600 ring-4 ring-gray-600/10" />
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Dropoff Location</p>
                  <p className="text-white font-medium">{dropoff.address}</p>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Vehicle Detail */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <img src={selectedVehicle.image_url || '/car-placeholder.png'} alt={selectedVehicle.title} className="w-12 h-12 object-contain" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Selected Vehicle</p>
                    <p className="text-white font-bold text-lg">{selectedVehicle.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-primary" /> Premium Service</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Total Fare</p>
                  <p className="text-3xl font-bold text-primary">
                    {selectedVehicle.currency || '$'}{selectedVehicle.estimated_price}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4">
                <Button 
                  onClick={handleBook} 
                  fullWidth 
                  size="lg" 
                  isLoading={isLoading}
                  className="py-6 text-xl font-bold"
                >
                  Book This Ride <ChevronRight className="ml-2 w-6 h-6" />
                </Button>
                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  Secure Payment Processed via Stripe
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
