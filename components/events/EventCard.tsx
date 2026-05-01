import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { ClockIcon, MapPinIcon } from 'lucide-react';
type EventType = 'concert' | 'sports' | 'gala' | 'festival' | 'conference';
type EventCardProps = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  type: EventType;
  onBook: () => void;
};
export function EventCard({
  title,
  date,
  time,
  location,
  description,
  image,
  type,
  onBook
}: EventCardProps) {

 console.log('Event date:', date);
  const typeColors = {
    concert: 'bg-purple-500/20 text-purple-400',
    sports: 'bg-orange-500/20 text-orange-400',
    gala: 'bg-primary/20 text-primary',
    festival: 'bg-green-500/20 text-green-400',
    conference: 'bg-blue-500/20 text-blue-400'
  };
  return <Card padding="none" className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48">
        {image && <img src={image} alt={title} className="w-full h-full object-cover" />}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${typeColors[type]}`}>
            {type}
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm font-bold text-primary mb-1">{date}</div>
            <h3 className="text-xl font-bold text-grey-pastel">{title}</h3>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-grey-medium">
            <ClockIcon className="w-4 h-4 mr-2 text-primary" />
            {time}
          </div>
          <div className="flex items-center text-sm text-grey-medium">
            <MapPinIcon className="w-4 h-4 mr-2 text-primary" />
            {location}
          </div>
        </div>

        <p className="text-sm text-grey-medium mb-6 line-clamp-2 flex-1">
          {description}
        </p>

        <Button variant="outline" fullWidth onClick={() => onBook()}>
          Book Transportation
        </Button>
      </div>
    </Card>;
}

