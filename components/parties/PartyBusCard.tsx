import React from 'react';
import { Card } from '@/components/shared/Card'; // Assuming you have this
import { Button } from '@/components/shared/Button'; // Assuming you have this
import { Users, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PartyBusCardProps {
  id: number;
  name: string;
  images: string;
  // amenities: string[];
  rating: string;
  description: string;
  onReserve: () => void;
  capacity?: number;
  pricePerHour?: number;

}

export function PartyBusCard({
  name,
  images,
  id,
  // amenities,
  rating,
  description,
  onReserve
}: PartyBusCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-primary/50 transition-colors duration-300 flex flex-col md:flex-row h-full md:h-72">
        
        {/* Image Section */}
        <div className="md:w-2/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
          {images && <img 
            src={images}
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />}
          <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center border border-white/10">
            <Star className="w-3 h-3 text-primary fill-primary mr-1" />
            <span className="text-xs font-bold text-grey-pastel">{rating}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-bold text-grey-pastel group-hover:text-primary transition-colors">
                {name}
              </h3>
            </div>
            
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
              {description}
            </p>

            {/* <div className="flex flex-wrap gap-2 mb-6">
              {amenities.slice(0, 3).map((feature, idx) => (
                <span key={idx} className="text-xs font-medium text-gray-300 bg-neutral-800 px-3 py-1.5 rounded-md border border-neutral-700">
                  {feature.trim()}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="text-xs font-medium text-gray-500 px-2 py-1.5">
                  +{amenities.length - 3} more
                </span>
              )}
            </div> */}
          </div>

          <div className="flex items-center justify-between mt-auto border-t border-neutral-800 pt-6">
            <div className="flex items-center text-gray-400 text-sm">
              <Users className="w-4 h-4 mr-2 text-primary" />
              <span>Max 20 Guests</span>
            </div>
            <Link 
            href={`/parties/${id}`}
            >
            <Button 
              onClick={onReserve}
              variant="ghost" 
              className="text-grey-pastel p-0 flex items-center gap-2 group/btn"
            >
              View Details 
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}