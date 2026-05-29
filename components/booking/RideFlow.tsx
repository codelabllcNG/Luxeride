"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocationSearch } from './LocationSearch';
import { useRideFlow } from '@/lib/hooks/useRideFlow';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { VehicleQuoteList } from './VehicleQuoteList';
import { ChevronRight, Car, Clock, ShieldCheck, MapPin, Receipt, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function RideFlow() {
  const { 
    isLoading,
    fetchQuote,
    bookRide,
    pickup, setPickup, 
    dropoff, setDropoff, 
    quote,
    selectedVehicle, setSelectedVehicle,
    activeTrip,
    step, setStep,
    serviceType, setServiceType,
    hours, setHours,
    reset
  } = useRideFlow();

  const handleGetPrices = async () => {
    if (!pickup) {
      toast.error("Please enter a pickup location");
      return;
    }
    if (serviceType === 'ride' && !dropoff) {
      toast.error("Please enter a dropoff location");
      return;
    }
    await fetchQuote(pickup, dropoff);
  };

  const handleConfirmRide = async () => {
    if (!selectedVehicle) {
      toast.error("Please select a vehicle");
      return;
    }
    await bookRide(selectedVehicle);
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <Card className="max-w-xl mx-auto bg-dark-charcoal/80 backdrop-blur-xl border-white/10 overflow-hidden shadow-2xl">
      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {/* Premium Service Type Selector */}
              <div className="flex space-x-2 bg-white/5 p-1 rounded-xl ring-1 ring-white/10">
                <button
                  type="button"
                  onClick={() => setServiceType('ride')}
                  className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${serviceType === 'ride' ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}
                >
                  <Car className="w-3.5 h-3.5" />
                  Standard Ride
                </button>
                <button
                  type="button"
                  onClick={() => setServiceType('hourly')}
                  className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${serviceType === 'hourly' ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Hourly Booking
                </button>
              </div>

              <div className="space-y-4">
                <LocationSearch 
                  label="Pickup Location" 
                  placeholder="Where from?" 
                  onSelect={setPickup}
                  initialValue={pickup?.address}
                />
                
                <div className="relative">
                  <LocationSearch 
                    label={serviceType === 'hourly' ? "Dropoff Location (Optional)" : "Dropoff Location"} 
                    placeholder={serviceType === 'hourly' ? "Where to? (Optional)" : "Where to?"} 
                    onSelect={setDropoff}
                    initialValue={dropoff?.address}
                  />
                  {serviceType === 'hourly' && (
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      Note: Dropoff is optional. Driver will take you anywhere during your booked hours.
                    </span>
                  )}
                </div>

                {serviceType === 'hourly' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-grey-medium uppercase tracking-wider">
                      Duration (Hours)
                    </label>
                    <div className="relative">
                      <select
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        className="w-full bg-dark-lighter border border-white/10 text-grey-pastel rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
                      >
                        {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
                          <option key={h} value={h} className="bg-dark-charcoal text-white">
                            {h} {h === 1 ? 'Hour' : 'Hours'}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                        <Clock className="w-4 h-4 text-primary opacity-60" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 py-2">
                {[
                  { icon: Car, label: "Premium" },
                  { icon: Clock, label: "Real-time" },
                  { icon: ShieldCheck, label: "Secure" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center space-y-2 text-center">
                    <div className="p-3 bg-white/5 rounded-full ring-1 ring-white/10">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-grey-dark font-bold">{item.label}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleGetPrices} 
                fullWidth 
                size="lg" 
                isLoading={isLoading}
                disabled={!pickup || (serviceType === 'ride' && !dropoff)}
              >
                Get Prices <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
