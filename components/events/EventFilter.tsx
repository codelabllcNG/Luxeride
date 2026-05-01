import { Card } from '../shared/Card';
import { EventCategory } from '@/lib/api/event';
import { decode } from 'html-entities';


type EventFilterProps = {
  categories: EventCategory[]; 
  selectedType: string;
  onSelect: (slug: string) => void;
};

export function EventFilter({
  categories,
  selectedType,
  onSelect
}: EventFilterProps) {
  
  return (
    <Card className="sticky top-24" padding="md">
      <h3 className="font-bold text-grey-pastel mb-4">Filter Events</h3>
      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.slug)}
            className={`
              w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
              ${
                selectedType === category.slug
                  ? 'bg-primary text-black font-bold'
                  : 'text-grey-medium hover:bg-dark-lighter hover:text-grey-pastel'
              }
            `}
          >
            {decode(category.name)}
          </button>
        ))}
      </div>
    </Card>
  );
}