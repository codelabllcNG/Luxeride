
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchLocationSuggestions, reverseGeocode, LocationSuggestion } from '@/lib/api/location';
import { toast } from 'sonner';

interface LocationSearchProps {
  label: string;
  placeholder: string;
  onSelect: (location: LocationSuggestion) => void;
  initialValue?: string;
}

export function LocationSearch({ label, placeholder, onSelect, initialValue = "" }: LocationSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 3 && isOpen) {
        setIsLoading(true);
        const results = await fetchLocationSuggestions(query);
        setSuggestions(results);
        setIsLoading(false);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setIsOpen(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const result = await reverseGeocode(latitude, longitude);
        
        if (result) {
          onSelect(result);
          setQuery(result.address);
          setIsOpen(false);
          toast.success("Location updated");
        } else {
          toast.error("Could not determine address for your location");
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error(error.message || "Failed to get location");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="block text-xs font-semibold text-grey-medium uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <MapPin className="w-4 h-4 text-primary opacity-60 group-focus-within:opacity-100 transition-opacity" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-dark-lighter border border-white/10 text-grey-pastel rounded-xl pl-11 pr-10 py-3.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-grey-dark"
        />
        {query && (
          <button 
            onClick={() => { setQuery(""); setSuggestions([]); }}
            className="absolute inset-y-0 right-3 flex items-center text-grey-dark hover:text-grey-pastel transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (suggestions.length > 0 || isLoading || !query) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-dark-charcoal border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <ul className="max-h-64 overflow-y-auto">
              {/* Current Location Option */}
              {!query && (
                <li>
                  <button
                    onClick={handleGetCurrentLocation}
                    disabled={isLocating}
                    className="w-full text-left px-4 py-4 hover:bg-white/5 transition-colors flex items-center space-x-3 group border-b border-white/5"
                  >
                    {isLocating ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    ) : (
                      <Target className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    )}
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-grey-pastel block">Use Current Location</span>
                      <span className="text-[10px] text-primary uppercase font-bold tracking-widest">Nearby</span>
                    </div>
                  </button>
                </li>
              )}

              {isLoading ? (
                <div className="p-4 flex items-center justify-center text-grey-medium italic">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Searching...
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        onSelect(suggestion);
                        setQuery(suggestion.address);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-start space-x-3 group"
                    >
                      <Search className="w-4 h-4 mt-1 text-grey-dark group-hover:text-primary transition-colors" />
                      <span className="text-sm text-grey-medium group-hover:text-grey-pastel line-clamp-2">
                        {suggestion.address}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
