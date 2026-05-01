'use client';

import React from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { UsersIcon, CheckIcon } from 'lucide-react';
import { ImageCarousel } from '../listing/ImageCarousel';

type TourVehicleCardProps = {
  name: string;
  images: string[];
  capacity: number;
  price: string;
  features: string[];
  onBook: () => void;
};

export function TourVehicleCard({
  name,
  images,
  capacity,
  price,
  features,
  onBook
}: TourVehicleCardProps) {
  return (
    <Card padding="none" className="overflow-hidden h-full flex flex-col">
      <div className="h-48">
        <ImageCarousel images={images} autoPlay={false} />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-grey-pastel">{name}</h3>
            <div className="flex items-center text-sm text-grey-medium mt-1">
              <UsersIcon className="w-4 h-4 mr-1" />
              Up to {capacity} passengers
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">{price}</div>
            <div className="text-xs text-grey-medium">per hour</div>
          </div>
        </div>

        <div className="space-y-2 mb-6 flex-1">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-grey-medium">
              <CheckIcon className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
              {feature}
            </div>
          ))}
        </div>

        <Button variant="primary" fullWidth onClick={onBook}>
          Book This Tour
        </Button>
      </div>
    </Card>
  );
}