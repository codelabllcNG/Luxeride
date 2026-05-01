'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

type ImageCarouselProps = {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
};

export function ImageCarousel({
  images,
  autoPlay = true,
  interval = 5000
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[450px] bg-dark-charcoal overflow-hidden group">
      
      {/* Main Image Layer */}
      <AnimatePresence mode="wait">
        <motion.img 
          key={currentIndex} 
          src={images[currentIndex]} 
          alt={`Vehicle view ${currentIndex + 1}`} 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.5 }} 
          className="w-full h-full object-cover" 
        />
      </AnimatePresence>

      {/* Navigation Layer - Only show if > 1 image */}
      {images.length > 1 && (
        <>
          {/* Gradient Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Arrows */}
          <button 
            onClick={goToPrevious} 
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 backdrop-blur-md text-grey-pastel hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100 duration-300"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button 
            onClick={goToNext} 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 backdrop-blur-md text-grey-pastel hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100 duration-300"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Thumbnails (Bottom Center) */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 px-4">
            {images.map((image, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentIndex(index)} 
                className={`
                  relative w-16 h-12 rounded-lg overflow-hidden transition-all duration-300 border-2
                  ${index === currentIndex ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}
                `}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}