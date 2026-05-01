'use client';

import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { ContactAdminModal } from './ContactAdminModal';
import { BookingDetailsModal } from './BookingDetailsModal';
import { CalendarIcon, MapPinIcon, ClockIcon, CarIcon,PhoneIcon } from 'lucide-react';

type BookingStatus = 'upcoming' | 'completed' | 'cancelled' | 'publish';

type BookingHistoryCardProps = {
  id: string;
  service: string;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  price: string;
  status: BookingStatus;
  passengers?: string;
  onReview?: () => void;
};

export function BookingHistoryCard({
  id,
  service,
  date,
  time,
  pickup,
  dropoff,
  price,
  status,
  passengers,
  onReview
}: BookingHistoryCardProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);

  const statusColors: Record<string, string> = {
    publish: 'bg-blue-500/20 text-blue-400',
    upcoming: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400'
  };

  const displayStatus = status === 'publish' ? 'upcoming' : status;

  const ADMIN_PHONE = "+1234567890"; 

  const isPending = price === "Pending Quote";

  return (
    <>
      <Card className="mb-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-grey-pastel text-lg">{service}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.upcoming}`}>
                {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
              </span>
            </div>
            <p className="text-xs text-grey-medium mb-4">Booking ID: {id}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-grey-medium">
                  <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
                  {date}
                </div>
                <div className="flex items-center text-sm text-grey-medium">
                  <ClockIcon className="w-4 h-4 mr-2 text-primary" />
                  {time}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-grey-medium">
                  <MapPinIcon className="w-4 h-4 mr-2 text-primary" />
                  <span className="truncate block w-full max-w-[200px]">{pickup}</span>
                </div>
                <div className="flex items-center text-sm text-grey-medium">
                  <CarIcon className="w-4 h-4 mr-2 text-primary" />
                  <span className="truncate block w-full max-w-[200px]">{dropoff}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-dark-lighter pt-4 md:pt-0 md:pl-6 min-w-[160px]">
          <div className="w-full text-right mb-4">
              {isPending ? (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">Pricing</span>
                  <a 
                    href={`tel:${ADMIN_PHONE}`}
                    className="flex items-center gap-2 text-grey-pastel hover:text-primary transition-colors group"
                  >
                    <span className="font-bold">Inquire for Price</span>
                    <div className="p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20">
                      <PhoneIcon className="w-4 h-4 text-primary" />
                    </div>
                  </a>
                </div>
              ) : (
                <div className="text-xl font-bold text-primary">{price}</div>
              )}
            </div>
            <div className="space-y-2 w-full">
              <Button variant="outline" size="sm" fullWidth onClick={() => setIsViewDetailsModalOpen(true)}>
                View Details
              </Button>
              
              {(status === 'upcoming' || status === 'publish') && (
                <button 
                  onClick={() => setIsCancelModalOpen(true)} 
                  className="w-full text-xs text-red-400 hover:text-red-300 transition-colors py-1 font-medium"
                >
                  Cancel Booking
                </button>
              )}
              
              {status === 'completed' && (
                <Button variant="primary" size="sm" fullWidth onClick={onReview}>
                  Write Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <ContactAdminModal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        bookingId={id}
      />

      <BookingDetailsModal 
        isOpen={isViewDetailsModalOpen} 
        onClose={() => setIsViewDetailsModalOpen(false)} 
        booking={{
          id: id,
          title: `Booking for ${service}`,
          date_created: new Date().toISOString(), 
          status: status,
          service_type: service,
          pickup_location: pickup,
          dropoff_location: dropoff,
          passengers: passengers || '1',
          pickup_date: date,
          pickup_time: time,
        }}
      />
    </>
  );
}