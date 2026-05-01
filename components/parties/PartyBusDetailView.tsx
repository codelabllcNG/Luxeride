'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Wifi, Music, Zap, ShieldCheck, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { PartyBusDetail } from '@/lib/types/party';

export default function PartyBusDetailView({ data }: { data: PartyBusDetail }) {
  // DATA FILLING LOGIC
  const title = data.custom_title || data.title;
  const displayImage = typeof data.image_url === 'string' && data.image_url 
    ? data.image_url 
    : "https://luxride.niishcloud.com/wp-content/uploads/2026/01/photo-1552519507-da3b142c6e3d-1.jpg"; // Fallback
  
  const description = data.content || data.short_description || 
    `Experience the ultimate in luxury with our ${title}. Perfect for weddings, proms, or corporate events, this vehicle offers state-of-the-art amenities and unmatched comfort.`;

  const features = ["Premium Leather Seats", "Surround Sound", "Privacy Partition", "Fiber Optic Lighting", "Mini Bar"];

  return (
    <main className="min-h-screen bg-neutral-950 text-grey-pastel">
      {/* Immersive Header */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent z-10" />
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full z-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  VIP Fleet
                </span>
                <span className="text-gray-400 text-sm flex items-center">
                  <Calendar className="w-4 h-4 mr-2" /> Added: {data.date}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-grey-pastel shadow-xl">
                {title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-grey-pastel mb-4">Overview</h2>
              <p className="text-gray-400 text-lg leading-relaxed">{description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-grey-pastel mb-6">Onboard Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                      {idx % 2 === 0 ? <Music size={20}/> : <Zap size={20}/>}
                    </div>
                    <span className="font-medium text-gray-200">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-neutral-900 border-neutral-800 p-6 shadow-2xl">
                <div className="flex justify-between items-end mb-6 border-b border-neutral-800 pb-6">
                  <div>
                    <p className="text-gray-400 text-sm">Hourly Rate</p>
                    <div className="text-3xl font-bold text-grey-pastel">$250<span className="text-lg text-gray-500 font-normal">/hr</span></div>
                  </div>
                  <div className="flex items-center bg-green-900/30 px-3 py-1 rounded text-green-400 text-sm font-medium">
                    <ShieldCheck className="w-4 h-4 mr-1" /> Available
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="flex items-center"><Users className="w-4 h-4 mr-2"/> Capacity</span>
                    <span className="font-bold">20-25 Guests</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="flex items-center"><Wifi className="w-4 h-4 mr-2"/> WiFi</span>
                    <span className="font-bold">Included</span>
                  </div>
                </div>

                <Button variant="primary" fullWidth size="lg" className="mb-3">
                  Book This Vehicle
                </Button>
                <Button variant="outline" fullWidth>
                  Custom Quote
                </Button>
                
                <div className="mt-6 flex items-start gap-3 text-xs text-gray-500 bg-black/20 p-3 rounded">
                  <Info className="w-4 h-4 shrink-0" />
                  <p>Minimum 4-hour booking required on weekends. Alcohol permitted for 21+ guests only.</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}