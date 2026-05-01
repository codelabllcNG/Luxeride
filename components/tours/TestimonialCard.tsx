import React from 'react';
import Image from 'next/image';
import { Card } from '../shared/Card';
import { StarIcon, QuoteIcon } from 'lucide-react';

type TestimonialCardProps = {
  name: string;
  location: string;
  rating: number;
  quote: string;
  image?: string;
};

export function TestimonialCard({
  name,
  location,
  rating,
  quote,
  image
}: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <div className="flex items-center space-x-4 mb-4">
        {/* Avatar Container - Added 'relative' for Next.js Image fill */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-dark-lighter">
          {image ? (
            <Image 
              src={image} 
              alt={name} 
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xl">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-grey-pastel">{name}</h4>
          <p className="text-xs text-grey-medium">{location}</p>
        </div>
      </div>

      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <StarIcon 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-primary fill-primary' : 'text-grey-muted'}`} 
          />
        ))}
      </div>

      <div className="relative">
        <QuoteIcon className="w-6 h-6 text-dark-lighter absolute -top-2 -left-2 transform -scale-x-100 opacity-50" />
        <p className="text-sm text-grey-medium italic pl-4 relative z-10">
          "{quote}"
        </p>
      </div>
    </Card>
  );
}