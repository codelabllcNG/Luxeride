'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSignIcon, InfoIcon } from 'lucide-react';

type PriceEstimatorProps = {
  estimatedPrice: number | null;
  distance?: string;
  duration?: string;
  vehicleType?: string;
};

export function PriceEstimator({
  estimatedPrice,
  distance,
  duration,
  vehicleType
}: PriceEstimatorProps) {
  if (!estimatedPrice) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-lighter rounded-lg p-4 border border-primary/30 mt-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm text-grey-medium mb-1">Estimated Price</h4>
          <div className="flex items-center text-2xl font-bold text-primary">
            <DollarSignIcon className="w-5 h-5 mr-1" />
            {estimatedPrice.toFixed(2)}
          </div>
        </div>
        <div className="text-right text-xs text-grey-medium">
          {vehicleType && (
            <div className="font-medium text-grey-pastel mb-1">
              {vehicleType}
            </div>
          )}
          {distance && <div>Distance: {distance}</div>}
          {duration && <div>Duration: {duration}</div>}
        </div>
      </div>
      <div className="flex items-start mt-3 text-xs text-grey-muted">
        <InfoIcon className="w-3 h-3 mr-1 mt-0.5 shrink-0" />
        <p>
          Final price may vary based on traffic, tolls, and additional stops.
        </p>
      </div>
    </motion.div>
  );
}