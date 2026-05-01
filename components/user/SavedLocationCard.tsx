import React from 'react';
import { Card } from '../shared/Card';
import { MapPinIcon, EditIcon, TrashIcon, HomeIcon, BriefcaseIcon, PlaneIcon } from 'lucide-react';
type LocationType = 'home' | 'work' | 'airport' | 'other';
type SavedLocationCardProps = {
  type: LocationType;
  name: string;
  address: string;
  onEdit: () => void;
  onDelete: () => void;
};
export function SavedLocationCard({
  type,
  name,
  address,
  onEdit,
  onDelete
}: SavedLocationCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'home':
        return <HomeIcon className="w-5 h-5" />;
      case 'work':
        return <BriefcaseIcon className="w-5 h-5" />;
      case 'airport':
        return <PlaneIcon className="w-5 h-5" />;
      default:
        return <MapPinIcon className="w-5 h-5" />;
    }
  };
  return <Card className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-full bg-dark-lighter text-primary">
          {getIcon()}
        </div>
        <div>
          <h4 className="font-semibold text-grey-pastel">{name}</h4>
          <p className="text-sm text-grey-medium">{address}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={onEdit} className="p-2 text-grey-medium hover:text-primary hover:bg-dark-lighter rounded-lg transition-colors">
          <EditIcon className="w-4 h-4" />
        </button>
        <button onClick={onDelete} className="p-2 text-grey-medium hover:text-red-400 hover:bg-dark-lighter rounded-lg transition-colors">
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </Card>;
}