'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { MapPinIcon, ClockIcon, CameraIcon } from 'lucide-react';

type TourHighlightCardProps = {
  name: string;
  image: string;
  description: string;
  duration: string;
  highlights: string[];
  bestTime: string;
  onBook: () => void;
};

export function TourHighlightCard({
  name,
  image,
  description,
  duration,
  highlights,
  bestTime,
  onBook
}: TourHighlightCardProps) {
  return (
    <Card 
      padding="none" 
      className="overflow-hidden h-full flex flex-col group hover:border-primary/50 transition-all"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image 
          src={image} 
          alt={name} 
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h3 className="text-2xl font-bold text-grey-pastel mb-1">{name}</h3>
          <div className="flex items-center text-sm text-grey-pastel">
            <ClockIcon className="w-4 h-4 mr-1" />
            {duration}
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Description */}
        <p className="text-sm text-grey-medium mb-4">{description}</p>

        {/* Highlights */}
        <div className="mb-4 flex-1">
          <h4 className="text-xs font-semibold text-grey-medium uppercase tracking-wider mb-2">
            What You'll See
          </h4>
          <ul className="space-y-2">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-start text-sm text-grey-pastel">
                <CameraIcon className="w-4 h-4 mr-2 text-primary mt-0.5 flex-shrink-0" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        {/* Best Time */}
        <div className="mb-4 p-3 bg-dark-lighter rounded-lg border border-dark-lighter">
          <div className="text-xs text-grey-medium mb-1">
            Best Time to Visit
          </div>
          <div className="text-sm text-grey-pastel font-medium">{bestTime}</div>
        </div>

        {/* CTA */}
        <Button variant="primary" fullWidth onClick={onBook}>
          Book This Tour
        </Button>
      </div>
    </Card>
  );
}