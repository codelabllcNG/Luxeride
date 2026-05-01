'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, CalendarIcon, MapPinIcon, UserIcon, ClockIcon, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { ApiVehicle } from './VehicleCard';
import { getLocationSuggestion } from '@/lib/api/booking'; 
import { useAuthStore } from '@/lib/store/useAuthStore';
import { toast } from 'sonner';
import { createBooking } from '@/lib/api/booking';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: ApiVehicle | null;

}

export function BookingModal({ isOpen, onClose, vehicle }: BookingModalProps) {
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    pickup_date: '',
    pickup_time: '',
    pickup_location: '',
    dropoff_location: '',
    passengers: '1',
  });
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [activeField, setActiveField] = useState<'pickup' | 'dropoff' | null>(null);
  const pickupRef = useRef<HTMLDivElement>(null);
  const dropoffRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFormData((prev) => ({
        ...prev,
        customer_name: `${user.first_name} ${user.last_name}`.trim(),
        email: user.email || '',
        phone: user.phone_number || '',
      }));
    }
  }, [isOpen, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) {
        setShowPickupSuggestions(false);
      }
      if (dropoffRef.current && !dropoffRef.current.contains(event.target as Node)) {
        setShowDropoffSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const query = activeField === 'pickup' ? formData.pickup_location : formData.dropoff_location;

    if (!activeField || !query || query.length < 3) {
      setIsFetchingSuggestions(false);
      return;
    }

    setIsFetchingSuggestions(true);

    const timer = setTimeout(async () => {
      try {
        const results = await getLocationSuggestion(query);
        
        if (activeField === 'pickup') {
          setPickupSuggestions(results.length > 0 ? results : ['No locations found']);
          setShowPickupSuggestions(true);
        } else {
          setDropoffSuggestions(results.length > 0 ? results : ['No locations found']);
          setShowDropoffSuggestions(true);
        }
      } catch (err) {
        console.error("Error fetching locations", err);
      } finally {
        setIsFetchingSuggestions(false);
      }
    }, 500); 
    return () => clearTimeout(timer);
  }, [formData.pickup_location, formData.dropoff_location, activeField]);


  if (!isOpen || !vehicle) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLocationType = (e: React.ChangeEvent<HTMLInputElement>, field: 'pickup' | 'dropoff') => {
    setActiveField(field);
    handleChange(e);
  };

  const handleSuggestionClick = (field: 'pickup' | 'dropoff', value: string) => {
    if (value === 'No locations found') return;
    
    setFormData(prev => ({
      ...prev,
      [field === 'pickup' ? 'pickup_location' : 'dropoff_location']: value
    }));
    
    setActiveField(null);
    if (field === 'pickup') setShowPickupSuggestions(false);
    else setShowDropoffSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalPayload = {
      service_id: vehicle.page_id.toString(),
      customer_name: formData.customer_name,
      email: formData.email,
      phone: formData.phone,
      service_type: `Booking for ${vehicle.title} - ${vehicle.subheading}`,
      service_name: `${vehicle.title} - ${vehicle.subheading}`,
      service_description: `Booking for ${vehicle.subheading}`,
      pickup_date: formData.pickup_date,
      pickup_time: formData.pickup_time,
      pickup_location: formData.pickup_location,
      dropoff_location: formData.dropoff_location,
      passengers: formData.passengers,
      vehicle_type: vehicle.title || "Vehicle",
      price: vehicle.price || "Quote",
    };

try {
      
      await createBooking(finalPayload);
      
      toast.success("Booking request sent successfully! We will contact you shortly.");
      onClose(); 
      
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-dark-charcoal border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-start bg-dark-lighter/50">
              <div>
                <h2 className="text-xl font-bold text-grey-pastel">Complete Your Booking</h2>
                <p className="text-sm text-primary mt-1">{vehicle.subheading}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-grey-medium">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Contact Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-grey-pastel uppercase tracking-wider flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-primary" /> Contact Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputGroup label="Full Name" name="customer_name" type="text" placeholder="John Doe" required value={formData.customer_name} onChange={handleChange} />
                    <InputGroup label="Email" name="email" type="email" placeholder="john@example.com" required value={formData.email} onChange={handleChange} />
                    <InputGroup label="Phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" required value={formData.phone} onChange={handleChange} />
                    <InputGroup label="Passengers" name="passengers" type="number" max={vehicle.capacity || 4} min={1} placeholder={`Max ${vehicle.capacity}`} required value={formData.passengers} onChange={handleChange} />
                  </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Trip Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-grey-pastel uppercase tracking-wider flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-primary" /> Trip Details
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputGroup label="Pickup Date" name="pickup_date" type="date" icon={<CalendarIcon className="w-4 h-4" />} required onChange={handleChange} />
                    <InputGroup label="Pickup Time" name="pickup_time" type="time" icon={<ClockIcon className="w-4 h-4" />} required onChange={handleChange} />
                  </div>

                  {/* --- AUTOCOMPLETE LOCATION INPUTS --- */}
                  <div className="grid md:grid-cols-2 gap-4">
                    
                    {/* Pickup Location with Suggestions */}
                    <div className="space-y-1.5" ref={pickupRef}>
                      <label className="text-xs text-grey-medium font-medium ml-1">Pickup Location</label>
                      <div className="relative">
                        <input 
                          name="pickup_location"
                          type="text"
                          placeholder="e.g. Dulles Airport"
                          required
                          value={formData.pickup_location}
                          onChange={(e) => handleLocationType(e, 'pickup')}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-grey-pastel placeholder:text-grey-dark focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                        />
                        {/* Spinner */}
                        {isFetchingSuggestions && activeField === 'pickup' && (
                           <div className="absolute right-3 top-3"><Loader2Icon className="w-4 h-4 text-primary animate-spin" /></div>
                        )}
                        {/* Dropdown */}
                        {showPickupSuggestions && pickupSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-dark-charcoal border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden max-h-48 overflow-y-auto">
                            {pickupSuggestions.map((s, i) => (
                              <button key={i} type="button" onClick={() => handleSuggestionClick('pickup', s)} className="w-full text-left px-4 py-2.5 hover:bg-white/5 text-grey-pastel text-sm border-b border-white/5 last:border-0 transition-colors">
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dropoff Location with Suggestions */}
                    <div className="space-y-1.5" ref={dropoffRef}>
                      <label className="text-xs text-grey-medium font-medium ml-1">Dropoff Location</label>
                      <div className="relative">
                        <input 
                          name="dropoff_location"
                          type="text"
                          placeholder="e.g. Downtown DC"
                          required
                          value={formData.dropoff_location}
                          onChange={(e) => handleLocationType(e, 'dropoff')}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-grey-pastel placeholder:text-grey-dark focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                        />
                        {/* Spinner */}
                         {isFetchingSuggestions && activeField === 'dropoff' && (
                           <div className="absolute right-3 top-3"><Loader2Icon className="w-4 h-4 text-primary animate-spin" /></div>
                        )}
                        {/* Dropdown */}
                        {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-dark-charcoal border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden max-h-48 overflow-y-auto">
                            {dropoffSuggestions.map((s, i) => (
                              <button key={i} type="button" onClick={() => handleSuggestionClick('dropoff', s)} className="w-full text-left px-4 py-2.5 hover:bg-white/5 text-grey-pastel text-sm border-b border-white/5 last:border-0 transition-colors">
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-white/5 bg-dark-lighter/30 flex justify-end gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-sm font-medium text-grey-medium hover:text-grey-pastel transition-colors"
              >
                Cancel
              </button>
              <Button 
                form="booking-form"
                variant="primary" 
                disabled={isSubmitting}
                className="min-w-35"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Request'}
              </Button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Keep the Simple InputGroup for other fields
function InputGroup({ label, icon, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-grey-medium font-medium ml-1">{label}</label>
      <div className="relative">
        <input 
          {...props}
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-grey-pastel placeholder:text-grey-dark focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
        />
        {icon && <div className="absolute right-3 top-3 text-grey-medium pointer-events-none">{icon}</div>}
      </div>
    </div>
  );
}