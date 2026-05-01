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
    if (!autoPlay) return;
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
  return <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-dark-charcoal">
      {/* Images */}
      <AnimatePresence mode="wait">
        <motion.img key={currentIndex} src={images[currentIndex]} alt={`Vehicle image ${currentIndex + 1}`} initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.5
      }} className="w-full h-full object-cover" />
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-dark/80 backdrop-blur-sm text-grey-pastel hover:bg-primary hover:text-black transition-colors" aria-label="Previous image">
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-dark/80 backdrop-blur-sm text-grey-pastel hover:bg-primary hover:text-black transition-colors" aria-label="Next image">
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={`
              w-2 h-2 rounded-full transition-all
              ${index === currentIndex ? 'w-8 bg-primary' : 'bg-grey-medium/50 hover:bg-grey-medium'}
            `} aria-label={`Go to image ${index + 1}`} />)}
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-16 left-4 right-4 flex justify-center space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={`
              flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all
              ${index === currentIndex ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'}
            `}>
            <img src={image} alt="" className="w-full h-full object-cover" />
          </button>)}
      </div>
    </div>;
}