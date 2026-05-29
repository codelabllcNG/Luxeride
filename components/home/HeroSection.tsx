'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Button } from '../Button';

const TripTracking = dynamic(() => import('../booking/TripTracking').then(mod => mod.TripTracking), {
  ssr: false,
  loading: () => (
    <div className="h-[450px] w-full rounded-3xl bg-dark-charcoal/50 border border-white/10 flex items-center justify-center backdrop-blur-xl">
      <div className="flex flex-col items-center gap-4 text-center p-8">
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <div className="space-y-2">
          <p className="text-white font-bold tracking-tight">Initializing Map</p>
          <p className="text-xs text-grey-medium">Connecting to secure GPS network...</p>
        </div>
      </div>
    </div>
  )
});
import { useBookingStore } from '@/lib/store/useBookingStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Sparkles, Star, ArrowRight } from 'lucide-react';

type HeroSectionProps = {
  hero: {
    background_image: string;
  }
};

export function HeroSection({ hero }: HeroSectionProps) {
  const { setModalOpen } = useBookingStore();
  const { user } = useAuthStore();

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 overflow-hidden">
      {/* Background with advanced overlays */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
           src={"/lp.png"}
        //  src={hero.background_image || "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=1920&h=1080&fit=crop&q=80"}
          alt="Luxury Ride"
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left space-y-8"
          >
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-[65px] font-black italic text-white leading-tight tracking-tight drop-shadow-lg">
                WE KEEP YOU<br/>
                <span className="text-primary drop-shadow-md">MOVING</span>
              </h1>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Button 
                  onClick={() => setModalOpen(true)}
                  variant="primary" 
                  size="lg" 
                  className="px-12 py-5 font-bold text-black text-xl flex items-center justify-center gap-3 uppercase tracking-widest w-full sm:w-auto shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 transition-transform"
                >
                  Book Now <ArrowRight className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}