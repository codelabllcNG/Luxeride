import React from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, UserCheckIcon, GaugeIcon, CalendarIcon, CheckCircleIcon } from 'lucide-react';
type VehicleDetailsProps = {
  name: string;
  type: string;
  description: string;
  capacity: number;
  year: number;
  hasDriver: boolean;
  features: string[];
};
export function VehicleDetails({
  name,
  type,
  description,
  capacity,
  year,
  hasDriver,
  features
}: VehicleDetailsProps) {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-sm text-primary font-medium">{type}</span>
        <h1 className="text-3xl md:text-4xl font-bold text-grey-pastel mt-1">
          {name}
        </h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-3 p-4 rounded-xl bg-dark-charcoal">
          <UsersIcon className="w-6 h-6 text-primary" />
          <div>
            <div className="text-lg font-semibold text-grey-pastel">
              {capacity}
            </div>
            <div className="text-xs text-grey-medium">Passengers</div>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-4 rounded-xl bg-dark-charcoal">
          <CalendarIcon className="w-6 h-6 text-primary" />
          <div>
            <div className="text-lg font-semibold text-grey-pastel">{year}</div>
            <div className="text-xs text-grey-medium">Year</div>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-4 rounded-xl bg-dark-charcoal">
          <UserCheckIcon className="w-6 h-6 text-primary" />
          <div>
            <div className="text-lg font-semibold text-grey-pastel">
              {hasDriver ? 'Yes' : 'No'}
            </div>
            <div className="text-xs text-grey-medium">Driver Included</div>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-4 rounded-xl bg-dark-charcoal">
          <GaugeIcon className="w-6 h-6 text-primary" />
          <div>
            <div className="text-lg font-semibold text-grey-pastel">
              Premium
            </div>
            <div className="text-xs text-grey-medium">Class</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold text-grey-pastel mb-3">
          About This Vehicle
        </h2>
        <p className="text-grey-medium leading-relaxed">{description}</p>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-xl font-semibold text-grey-pastel mb-4">
          Features & Amenities
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, index) => <div key={index} className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-grey-medium text-sm">{feature}</span>
            </div>)}
        </div>
      </div>
    </motion.div>;
}