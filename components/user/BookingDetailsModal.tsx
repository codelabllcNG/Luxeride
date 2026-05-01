'use client';

import React from 'react';
import { 
  XIcon, MapPinIcon, CalendarIcon, ClockIcon, 
  UsersIcon, BriefcaseIcon, CheckCircleIcon, NavigationIcon 
} from 'lucide-react';
import { Button } from '../shared/Button';

export interface BookingData {
  id?: string;
  title: string;
  date_created: string;
  status: string;
  service_type: string;
  pickup_location: string;
  dropoff_location: string;
  passengers: string | number;
  pickup_date: string;
  pickup_time: string;
}

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingData | null;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch { return dateStr; }
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return 'N/A';
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
  try {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch { return timeStr; }
};

export function BookingDetailsModal({ isOpen, onClose, booking }: BookingDetailsModalProps) {
  if (!isOpen || !booking) return null;

  const isConfirmed = booking.status === 'publish' || booking.status === 'upcoming';
  const isCancelled = booking.status === 'cancelled';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-charcoal border border-dark-lighter rounded-2xl shadow-2xl w-full max-w-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-lighter bg-dark-lighter/30">
          <div>
            <h2 className="text-xl font-bold text-grey-pastel">Trip Details</h2>
            <p className="text-sm text-grey-medium mt-1">
              Booking ID: <span className="font-mono text-primary">#{booking.id || 'N/A'}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-grey-medium transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          
          <div className="flex flex-wrap items-center justify-between gap-4 bg-dark-lighter rounded-xl p-4 border border-dark-lighter/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isConfirmed ? 'bg-green-500/10 text-green-400' : isCancelled ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                {isConfirmed ? <CheckCircleIcon className="w-5 h-5" /> : <ClockIcon className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-medium text-grey-pastel">Status</p>
                <p className={`text-sm font-bold capitalize ${isConfirmed ? 'text-green-400' : isCancelled ? 'text-red-400' : 'text-yellow-400'}`}>
                  {booking.status === 'publish' ? 'Confirmed' : booking.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-grey-medium">Request Date</p>
              <p className="text-sm text-grey-pastel font-medium">{formatDate(booking.date_created)}</p>
            </div>
          </div>

          {/* Route */}
          <div className="space-y-1 relative px-2">
            <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/50 to-primary/10 border-l border-dashed border-primary/30"></div>
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <MapPinIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Pickup</p>
                <p className="text-base text-grey-pastel font-medium">{booking.pickup_location}</p>
              </div>
            </div>

            <div className="h-8"></div>

            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                <NavigationIcon className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Dropoff</p>
                <p className="text-base text-grey-pastel font-medium">{booking.dropoff_location}</p>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailTile icon={<CalendarIcon/>} label="Date" value={formatDate(booking.pickup_date)} />
            <DetailTile icon={<ClockIcon/>} label="Time" value={formatTime(booking.pickup_time)} />
            <DetailTile icon={<UsersIcon/>} label="Passengers" value={`${booking.passengers} People`} />
            <DetailTile icon={<BriefcaseIcon/>} label="Service" value={booking.service_type} className="capitalize" />
          </div>
        </div>

        <div className="p-6 border-t border-dark-lighter bg-dark-lighter/30 flex justify-end">
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>
      </div>
    </div>
  );
}

// Sub-component for the grid tiles
function DetailTile({ icon, label, value, className = "" }: { icon: React.ReactNode, label: string, value: string, className?: string }) {
  return (
    <div className="bg-dark-lighter p-4 rounded-xl border border-dark-lighter/50 transition-colors hover:border-primary/20">
      <div className="flex items-center gap-2 mb-2 text-grey-medium">
  
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className={`text-base text-grey-pastel font-semibold ${className}`}>{value}</p>
    </div>
  );
}