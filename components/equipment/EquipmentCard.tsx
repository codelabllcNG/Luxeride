import React from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { InfoIcon } from 'lucide-react';
type EquipmentCardProps = {
  name: string;
  image: string;
  description: string;
  dailyRate: number;
  weeklyRate: number;
  specs: string[];
  onReserve: () => void;
};
export function EquipmentCard({
  name,
  image,
  description,
  dailyRate,
  weeklyRate,
  specs,
  onReserve
}: EquipmentCardProps) {
  return <Card padding="none" className="overflow-hidden flex flex-col h-full">
      <div className="h-48 bg-white p-4 flex items-center justify-center">
        <img src={image} alt={name} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-grey-pastel mb-2">{name}</h3>
        <p className="text-sm text-grey-medium mb-4 flex-1">{description}</p>

        <div className="bg-dark-lighter rounded-lg p-3 mb-4">
          <h4 className="text-xs font-semibold text-grey-medium uppercase mb-2">
            Specifications
          </h4>
          <ul className="space-y-1">
            {specs.map((spec, i) => <li key={i} className="text-xs text-grey-pastel flex items-start">
                <span className="mr-2 text-primary">•</span>
                {spec}
              </li>)}
          </ul>
        </div>

        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="text-2xl font-bold text-primary">${dailyRate}</div>
            <div className="text-xs text-grey-medium">per day</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-grey-pastel">
              ${weeklyRate}
            </div>
            <div className="text-xs text-grey-medium">per week</div>
          </div>
        </div>

        <Button variant="primary" fullWidth onClick={onReserve}>
          Reserve Now
        </Button>
      </div>
    </Card>;
}