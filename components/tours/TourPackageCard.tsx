'use client';

import React from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { ClockIcon, CheckCircleIcon } from 'lucide-react';

type TourPackageCardProps = {
  name: string;
  duration: string;
  price: string;
  description: string;
  inclusions: string[];
  popular?: boolean;
  onSelect: () => void;
};

export function TourPackageCard({
  name,
  duration,
  price,
  description,
  inclusions,
  popular,
  onSelect
}: TourPackageCardProps) {
  return (
    <Card 
      className={`relative h-full flex flex-col ${popular ? 'border-primary ring-1 ring-primary' : ''}`}
    >
      {popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-grey-pastel mb-2">{name}</h3>
        <div className="flex items-center justify-center text-grey-medium text-sm mb-4">
          <ClockIcon className="w-4 h-4 mr-1" />
          {duration}
        </div>
        <div className="text-3xl font-bold text-primary">{price}</div>
      </div>

      <p className="text-grey-medium text-center text-sm mb-6">{description}</p>

      <div className="space-y-3 mb-8 flex-1">
        {inclusions.map((item, index) => (
          <div key={index} className="flex items-start text-sm text-grey-pastel">
            <CheckCircleIcon className="w-4 h-4 mr-2 text-primary mt-0.5 flex-shrink-0" />
            {item}
          </div>
        ))}
      </div>

      <Button variant={popular ? 'primary' : 'outline'} fullWidth onClick={onSelect}>
        Select Package
      </Button>
    </Card>
  );
}