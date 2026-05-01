
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { VehicleQuote } from '@/lib/types/trips';
import { Users, Info, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';

interface VehicleQuoteListProps {
  vehicles: VehicleQuote[];
  onSelect: (vehicle: VehicleQuote) => void;
  isLoading?: boolean;
}

export function VehicleQuoteList({ vehicles, onSelect, isLoading }: VehicleQuoteListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-dark-lighter animate-pulse rounded-2xl border border-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {vehicles.map((vehicle, index) => (
        <motion.button
          key={vehicle.page_id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(vehicle)}
          className="w-full flex items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all group text-left"
        >
          {/* Vehicle Image */}
          <div className="relative w-24 h-16 mr-6 overflow-hidden rounded-lg bg-dark">
            <img
              src={vehicle.image_url || "/images/cars/placeholder.png"}
              alt={vehicle.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Vehicle Info */}
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <h4 className="text-grey-pastel font-bold text-lg">{vehicle.title}</h4>
              <div className="ml-2 flex items-center bg-primary/20 px-1.5 py-0.5 rounded text-[10px] font-bold text-primary">
                <Star className="w-2.5 h-2.5 mr-0.5 fill-primary" />
                {vehicle.rating || '4.9'}
              </div>
            </div>
            <div className="flex items-center space-x-3 text-grey-medium text-xs">
              <span className="flex items-center">
                <Users className="w-3.5 h-3.5 mr-1" />
                {vehicle.capacity || '4'} Seats
              </span>
              <span className="w-1 h-1 bg-grey-dark rounded-full" />
              <span className="text-primary font-medium">{vehicle.subheading || 'Luxury'}</span>
            </div>
          </div>

          {/* Price & Action */}
          <div className="text-right">
            <div className="text-xl font-bold text-grey-pastel mb-1">
              {vehicle.currency || '$'}{vehicle.estimated_price}
            </div>
            <div className="flex items-center justify-end text-primary text-xs font-semibold">
              Select <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
