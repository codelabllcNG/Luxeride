"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookingWidget } from "./booking/BookingWidget";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=1920&h=1080&fit=crop&q=80"
          alt="Luxury exotic car"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
      </div>

      {/* Content - Larger Booking Widget */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <motion.div
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="max-w-2xl"
        >
          <BookingWidget />
        </motion.div>
      </div>
    </section>
  );
}
