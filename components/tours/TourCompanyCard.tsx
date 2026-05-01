'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { StarIcon, MapPinIcon, PhoneIcon, ClockIcon } from 'lucide-react';

type TourCompanyCardProps = {
  id: string;
  name: string;
  logo?: string;
  description: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  location: string;
  phone: string;
  specialties: string[];
  image: string;
  onClick: () => void;
};

export function TourCompanyCard({
  id,
  name,
  logo,
  description,
  rating,
  reviewCount,
  priceRange,
  location,
  phone,
  specialties,
  image,
  onClick
}: TourCompanyCardProps) {
  return (
    <Card 
      padding="none" 
      className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all group" 
      onClick={onClick}
    >
      {/* Company Image */}
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={image} 
          alt={name} 
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {logo && (
          <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-lg p-2 shadow-lg z-10">
            <div className="relative w-full h-full">
              <Image 
                src={logo} 
                alt={`${name} logo`} 
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Company Name & Rating */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-grey-pastel group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center space-x-1">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            <span className="font-bold text-grey-pastel">{rating}</span>
            <span className="text-xs text-grey-medium">({reviewCount})</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-grey-medium mb-4 line-clamp-2">
          {description}
        </p>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2 mb-4">
          {specialties.slice(0, 3).map((specialty, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-dark-lighter text-xs text-grey-pastel rounded-full border border-dark-lighter"
            >
              {specialty}
            </span>
          ))}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-dark-lighter">
          <div className="flex items-center text-xs text-grey-medium">
            <MapPinIcon className="w-4 h-4 mr-1 text-primary" />
            {location}
          </div>
          <div className="flex items-center text-xs text-grey-medium">
            <PhoneIcon className="w-4 h-4 mr-1 text-primary" />
            {phone}
          </div>
        </div>

        {/* Price Range & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-grey-medium">Starting from</div>
            <div className="text-xl font-bold text-primary">{priceRange}</div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onClick();
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}