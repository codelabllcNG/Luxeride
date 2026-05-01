'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Check, Clock, Mail, User, Phone } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { createBooking } from '@/lib/api/booking'; // Ensure this path is correct
import { toast } from 'sonner';

interface EquipmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: {
    id?: string | number;
    page_id?: string | number; 
    name: string; 
    subheading?: string; 
    dailyRate: number;
    weeklyRate: number;
    image: string;
  } | null;
}

export function EquipmentBookingModal({ isOpen, onClose, equipment }: EquipmentBookingModalProps) {
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    pickup_date: '',
    pickup_time: '09:00',
    delivery_location: '',
    rental_duration: 'daily', 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user data
  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        customer_name: `${user.first_name} ${user.last_name}`.trim(),
        email: user.email || '',
        phone: user.phone_number || '',
      }));
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipment) return;
    
    setIsSubmitting(true);

    try {
      // Mapping equipment to 'vehicle' for your specific payload structure
      const vehicle = {
        page_id: equipment.page_id || equipment.id || "000",
        title: equipment.name,
        subheading: equipment.subheading || "Rental Unit",
        price: formData.rental_duration === 'daily' ? equipment.dailyRate : equipment.weeklyRate
      };

      const finalPayload = {
        service_id: vehicle.page_id.toString(),
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
        service_type: `Booking for ${vehicle.title} - ${formData.rental_duration} plan`,
        service_name: `${vehicle.title}`,
        service_description: `Duration: ${formData.rental_duration}`,
        pickup_date: formData.pickup_date,
        pickup_time: formData.pickup_time,
        pickup_location: formData.delivery_location,
        vehicle_type: vehicle.title || "Equipment",
        price: vehicle.price || "Quote",
      };
      await createBooking(finalPayload as any);
      
      toast.success("Reservation request sent successfully!");
      onClose();
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !equipment) return null;

  // Shared input style
  const inputStyle = "w-full bg-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all border border-transparent focus:border-yellow-500/50";
  const labelStyle = "text-xs text-zinc-400 font-medium ml-1 mb-1.5 block";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Simple Dark Overlay */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-[#18181b] rounded-xl shadow-2xl overflow-hidden border border-white/10"
        >
          {/* Header */}
          <div className="flex items-center gap-4 p-5 border-b border-white/5 bg-white/5">
            <div className="w-14 h-14 bg-white rounded-lg p-1 flex items-center justify-center shrink-0">
              <img src={equipment.image} alt={equipment.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white leading-tight">{equipment.name}</h2>
              <p className="text-yellow-500 font-medium text-xs mt-0.5">Starting at ${equipment.dailyRate}/day</p>
            </div>
            <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors hover:bg-white/10 rounded-full">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
            
            {/* Personal Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle}>Full Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-3 text-zinc-500" />
                    <input 
                      required
                      className={inputStyle}
                      placeholder="John Doe"
                      value={formData.customer_name}
                      onChange={e => setFormData({...formData, customer_name: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelStyle}>Phone</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-3 text-zinc-500" />
                    <input 
                      required
                      className={inputStyle}
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelStyle}>Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-3 text-zinc-500" />
                  <input 
                    required
                    type="email"
                    className={inputStyle}
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <hr className="border-white/5 my-1" />

            {/* Plan Selector */}
            <div>
              <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2 block">Rental Plan</label>
              <div className="grid grid-cols-2 gap-3">
                {['daily', 'weekly'].map((plan) => {
                  const isSelected = formData.rental_duration === plan;
                  return (
                    <div 
                      key={plan}
                      onClick={() => setFormData({...formData, rental_duration: plan})}
                      className={`
                        cursor-pointer rounded-lg p-3 border transition-all relative
                        ${isSelected ? 'border-yellow-500 bg-yellow-500/10' : 'border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800'}
                      `}
                    >
                      {isSelected && <Check size={14} className="absolute top-2 right-2 text-yellow-500" />}
                      <div className={`text-xs font-semibold capitalize mb-0.5 ${isSelected ? 'text-yellow-500' : 'text-zinc-400'}`}>
                        {plan}
                      </div>
                      <div className="text-base font-bold text-white">
                        ${plan === 'daily' ? equipment.dailyRate : equipment.weeklyRate}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Logistics */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelStyle}>Start Date</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-3 text-zinc-500" />
                  <input 
                    required type="date"
                    className={`${inputStyle} [color-scheme:dark]`}
                    value={formData.pickup_date}
                    onChange={e => setFormData({...formData, pickup_date: e.target.value})}
                  />
                </div>
              </div>

            </div>

            <div>
              <label className={labelStyle}>Delivery Address</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-3 text-zinc-500" />
                <input 
                  required
                  placeholder="Street Address, City, Zip"
                  className={inputStyle}
                  value={formData.delivery_location}
                  onChange={e => setFormData({...formData, delivery_location: e.target.value})}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-3 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-[2] bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg py-3 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-900/20"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Reservation'}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}