'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, UsersIcon, ArrowUpRightIcon } from 'lucide-react';
import { Card } from '@/components/shared/Card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export interface ApiVehicle {
  page_id: number;
  title: string | null;      
  subheading: string | null; 
  image_url: string;
  image_title: string;
  price: string | null;
  capacity: string | null;
  rating: string;
  link: string;
  description?: string;
  features?: string[];
}

interface VehicleCardProps {
  vehicle: ApiVehicle;
  index: number;
  onBook: (vehicle: ApiVehicle) => void; // Added Prop
}

export function VehicleCard({ vehicle, index, onBook }: VehicleCardProps) {
  const router = useRouter()
  const displayPrice = useMemo(() => {
    const p = vehicle.price;
    if (!p || parseInt(p) <= 0) return "Contact for Quote";
    return `$${p} / hr`;
  }, [vehicle.price]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link href={`/limo-booking/${vehicle.page_id}`}>
      <Card 
        padding="none" 
        className="h-full bg-dark-charcoal border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden flex flex-col"
      >
        {/* IMAGE SECTION */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={vehicle.image_url} 
            alt={vehicle.image_title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-charcoal via-transparent to-transparent opacity-60" />
          
          {/* <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-grey-pastel">
              {vehicle.title}
            </span>
          </div> */}

          <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-white/90 backdrop-blur-md text-xs font-bold text-black flex items-center gap-1">
            <StarIcon className="w-3 h-3 fill-black" />
            {vehicle.rating}
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="mb-4">
            {/* <h3 className="text-xl font-bold text-grey-pastel mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {vehicle.subheading}
            </h3> */}
            
            <div className="flex items-center gap-4 text-sm text-grey-medium">
              <div className="flex items-center gap-1.5">
                <UsersIcon className="w-4 h-4 text-primary" />
                <span>Up to {vehicle.capacity} Guests</span>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-white/5 my-auto" />

          {/* FOOTER ACTION */}
          <div className="pt-4 flex items-center justify-between mt-4">
            <div>
              <p className="text-xs text-grey-medium uppercase tracking-wider mb-0.5">Rate</p>
              <p className="text-primary font-semibold">{displayPrice}</p>
            </div>

          
           <button
              onClick={() => router.push(`/limo-booking/${vehicle.page_id}`)}
              className="flex items-center space-x-2 px-3 py-2.5 rounded-full bg-white/5 hover:bg-primary text-grey-pastel hover:text-black transition-all duration-300 font-medium text-sm group/btn"
            >
              <ArrowUpRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </Card>
      </Link>
    </motion.div>
  );
}