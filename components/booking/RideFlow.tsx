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
    reset
  } = useRideFlow();

  const handleGetPrices = async () => {
    if (!pickup || !dropoff) {
      toast.error("Please enter both pickup and dropoff locations");
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
              <div className="space-y-4">
                <LocationSearch 
                  label="Pickup Location" 
                  placeholder="Where from?" 
                  onSelect={setPickup}
                  initialValue={pickup?.address}
                />
                <LocationSearch 
                  label="Dropoff Location" 
                  placeholder="Where to?" 
                  onSelect={setDropoff}
                  initialValue={dropoff?.address}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 py-4">
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
                disabled={!pickup || !dropoff}
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
