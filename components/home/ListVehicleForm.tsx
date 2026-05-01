'use client';

import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Calendar, 
  Users, 
  User, 
  Phone, 
  Mail, 
  FileText,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore'; // Ensure path is correct
import { submitVehicleListing, type VehicleListingPayload } from '@/lib/api/listing'; // Ensure path is correct
import { toast } from 'sonner';
import { form } from 'framer-motion/client';

interface ListVehicleFormProps {
  onSuccess?: () => void;
}

export function ListVehicleForm({ onSuccess }: ListVehicleFormProps) {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    type: '',
    capacity: '',
    customer_name: '',
    phone: '',
    email: '',
    details: ''
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customer_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email || '',
        phone: user.phone_number || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Construct payload according to API requirements
      const payload: VehicleListingPayload = {
        customer_name: formData.customer_name,
        email: formData.email,
        phone_number: formData.phone,
        vehicle_type: formData.type,
        year: formData.year,
        vehicle_make: formData.make,
        vehicle_model: `${formData.make} ${formData.model}`.trim(),
        message: formData.details || "No additional details provided",
        capacity: formData.capacity
      };

      await submitVehicleListing(payload);
      
      toast.success("Listing request submitted successfully!");
      onSuccess?.();
      
      // Optional: Reset form excluding user details
      if (!user) {
        setFormData({
            make: '', model: '', year: '', type: '', capacity: '',
            customer_name: '', phone: '', email: '', details: ''
        });
      } else {
        // Keep contact info, reset vehicle info
        setFormData(prev => ({ 
            ...prev, make: '', model: '', year: '', type: '', capacity: '', details: '' 
        }));
      }

    } catch (error) {
      toast.error("Failed to submit listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-[#2A2A2A] border border-[#3F3F3F] rounded-lg py-3 px-10 text-grey-pastel placeholder-gray-500 focus:outline-none focus:border-primary transition-colors";
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vehicle Details Section */}
      <div>
        <h3 className="text-grey-pastel text-lg font-medium mb-4">Vehicle Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Car className={iconClasses} />
            <input 
              name="make"
              value={formData.make}
              onChange={handleChange}
              type="text" 
              placeholder="Vehicle Make (e.g. Mercedes)" 
              className={inputClasses} 
              required 
            />
          </div>
          <div className="relative">
            <Car className={iconClasses} />
            <input 
              name="model"
              value={formData.model}
              onChange={handleChange}
              type="text" 
              placeholder="Vehicle Model (e.g. S-Class)" 
              className={inputClasses} 
              required 
            />
          </div>
          <div className="relative">
            <Calendar className={iconClasses} />
            <input 
              name="year"
              value={formData.year}
              onChange={handleChange}
              type="number" 
              placeholder="Year" 
              className={inputClasses} 
              required 
            />
          </div>
          <div className="relative">
            <Car className={iconClasses} />
            <select 
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`${inputClasses} appearance-none cursor-pointer`} 
              required
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Limousine">Limousine</option>
              <option value="Party Bus">Party Bus</option>
              <option value="Van">Van</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
        <div className="relative mt-4">
          <Users className={iconClasses} />
          <input 
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            type="number" 
            placeholder="Passenger Capacity" 
            className={inputClasses} 
            required 
          />
        </div>
      </div>

      <hr className="border-[#3F3F3F]" />

      {/* Contact Information Section */}
      <div>
        <h3 className="text-grey-pastel text-lg font-medium mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="relative">
            <User className={iconClasses} />
            <input 
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              type="text" 
              placeholder="Your Full Name" 
              className={inputClasses} 
              required 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Phone className={iconClasses} />
              <input 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel" 
                placeholder="Phone Number" 
                className={inputClasses} 
                required 
              />
            </div>
            <div className="relative">
              <Mail className={iconClasses} />
              <input 
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email" 
                placeholder="Email Address" 
                className={inputClasses} 
                required 
              />
            </div>
          </div>
          <div className="relative">
            <FileText className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
            <textarea 
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Additional details about your vehicle (Color, Features, etc)..." 
              rows={3} 
              className={`${inputClasses} pt-3 h-32 resize-none`}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-black font-bold py-4 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          'Submit Listing Request'
        )}
      </button>
      
      <p className="text-center text-xs text-gray-500">
        By submitting, you agree to our partner terms and conditions.
      </p>
    </form>
  );
}