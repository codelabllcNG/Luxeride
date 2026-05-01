
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const TripTracking = dynamic(() => import('@/components/booking/TripTracking').then(mod => mod.TripTracking), { ssr: false });
import { ChatWidget } from '@/components/chat/ChatWidget';
import { getOngoingTrip } from '@/lib/api/trips';
import { useBookingStore } from '@/lib/store/useBookingStore';
import { PageLoader } from '@/components/shared/PageLoader';
import { Button } from '@/components/shared/Button';
import { ArrowLeft, Home } from 'lucide-react';
import { toast } from 'sonner';

export default function OngoingTripPage() {
  const { id } = useParams();
  const router = useRouter();
  const { activeTrip, setActiveTrip } = useBookingStore();
  const [isLoading, setIsLoading] = useState(!activeTrip || String(activeTrip?.id) !== String(id));

  useEffect(() => {
    async function verifyTrip() {
      if (!activeTrip || String(activeTrip?.id) !== String(id)) {
        setIsLoading(true);
        try {
          const response = await getOngoingTrip();
          console.log("OngoingTripPage: API Response:", response);
          if (response.status === 'success' && String(response.trip.id) === String(id)) {
            console.log("OngoingTripPage: ID match success, setting active trip");
            setActiveTrip(response.trip);
          } else {
            console.warn("OngoingTripPage: ID mismatch or failure. Expected:", id, "Got:", response.trip?.id);
            toast.error("Trip not found or already completed");
            router.push('/');
          }
        } catch (error) {
          toast.error("Error loading trip details");
          router.push('/');
        } finally {
          setIsLoading(false);
        }
      }
    }

    verifyTrip();
  }, [id, activeTrip, setActiveTrip, router]);


  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <main className="min-h-screen bg-dark pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
           <button 
             onClick={() => router.push('/')}
             className="flex items-center text-grey-medium hover:text-primary transition-colors group"
           >
             <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
           </button>
           <div className="text-right">
              <h1 className="text-2xl font-bold text-grey-pastel">Live Trip Tracking</h1>
              <p className="text-xs text-grey-medium">Trip ID: #{id}</p>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2">
            <TripTracking />
          </div>
          <div className="lg:col-span-1 h-full">
            <ChatWidget />
          </div>
        </div>

        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
           <p className="text-grey-medium text-sm mb-4">
             Need help with your journey? Our support team is available 24/7.
           </p>
           <Button variant="outline" size="sm" onClick={() => router.push('/contact')}>
              Contact Support
           </Button>
        </div>
      </div>
    </main>
  );
}
