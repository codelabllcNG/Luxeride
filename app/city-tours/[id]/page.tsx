'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { BookingModal } from '@/components/marketplace/BookingModal';
import { PageLoader } from '@/components/shared/PageLoader';
import {
  StarIcon,
  UsersIcon,
  ArrowLeftIcon,
  DollarSignIcon,
  ExternalLinkIcon,
  CheckIcon
} from 'lucide-react';

import { getTourById, CityTour } from '@/lib/api/tours';
import { useBookingStore } from '@/lib/store/useBookingStore';

export default function TourDetailPage() {
  const { setModalOpen } = useBookingStore();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CityTour | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      const tour = await getTourById(id);
      if (tour) setData(tour);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <PageLoader />;
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-dark pb-24">
      {/* 1. HERO SECTION */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        <div className="absolute inset-0">
          <Image src={data.image_url} alt={data.image_title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-transparent to-dark" />
        </div>
        
        <div className="absolute top-24 left-0 right-0 px-4 max-w-7xl mx-auto z-20">
          <button onClick={() => router.back()} className="flex items-center space-x-2 text-grey-pastel/80 hover:text-primary bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full transition-all">
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-12 z-20">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center space-x-2 text-primary font-bold uppercase text-sm mb-2">
                <StarIcon className="w-4 h-4 fill-primary" />
                <span>{data.rating} Rated Experience</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-grey-pastel mb-4">{data.title}</h1>
              <p className="text-xl text-grey-pastel max-w-2xl">{data.subheading}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-30">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Stats */}
            <div className="bg-dark-charcoal border border-white/5 rounded-2xl p-6 flex flex-wrap gap-8 items-center justify-between shadow-xl">
              <DetailStat icon={<UsersIcon />} label="Capacity" value={`${data.capacity} People`} />
              <DetailStat icon={<StarIcon />} label="Rating" value={`${data.rating} / 5`} />
              <DetailStat icon={<DollarSignIcon />} label="Starting From" value={`$${data.price}`} />
            </div>

            {/* Description Card */}
            <div className="bg-dark-charcoal/50 rounded-2xl p-8 border border-white/5">
              <h2 className="text-2xl font-bold text-grey-pastel mb-6">About this Experience</h2>
              
              {/* DESCRIPTION TEXT - Kept exactly as requested */}
              <div className="prose prose-invert text-grey-medium mb-10 leading-relaxed">
                <p>{data.subheading}</p>
                <p className="mt-4">
                 {data.description}
                </p>
              </div>

              
{data.features.length > 0 && (
  <div className="border-t border-white/10 pt-8">
    <h3 className="text-xs font-bold text-grey-pastel uppercase tracking-[0.2em] mb-6">
      Included Features
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
      {data.features.map((feature) => (
        <FeatureItem key={feature} label={feature} />
      ))}
    </div>
  </div>
)}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <BookingCard price={data.price} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


function FeatureItem({ label }: { label: string }) {
  return (
    <div className="flex items-center space-x-3 group">
      <div className="flex-shrink-0">
        <CheckIcon className="w-5 h-5 text-primary" strokeWidth={3} />
      </div>
      <span className="text-grey-medium text-lg font-medium">{label}</span>
    </div>
  );
}

function DetailStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-primary/10 rounded-full text-primary">{icon}</div>
      <div>
        <p className="text-xs text-grey-medium uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-grey-pastel">{value}</p>
      </div>
    </div>
  );
}

function BookingCard({ price }: { price: string }) {
  const { setModalOpen } = useBookingStore();
  return (
    <Card className="bg-dark-charcoal border-primary/30 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-grey-medium">Total Price</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-grey-pastel">${price}</span>
            <span className="text-sm text-grey-medium">/ per person</span>
          </div>
        </div>
        <Button variant="primary" size="lg" fullWidth className="h-14" onClick={() => setModalOpen(true)}>
          Book Now <ExternalLinkIcon className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </Card>
  );
}