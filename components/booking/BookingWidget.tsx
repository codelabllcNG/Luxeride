'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '../shared/Button';
// import { PriceEstimator } from './PriceEstimator'; // Uncomment if needed
import { useAuthStore } from '@/lib/store/useAuthStore';
import {toast} from 'sonner';
import { createBooking, BookingPayload } from '@/lib/api/booking';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  CarIcon, 
  UsersIcon, 
  Navigation2Icon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  ArrowLeftIcon,
  Loader2Icon
} from 'lucide-react';
import { getLocationSuggestion } from '@/lib/api/booking';
import { formatDatePayload, formatTimePayload } from '@/lib/helpers/format';
// Import the API function (assuming it's in a reachable file, or defined below as per your snippet)
import { getAllVehicles, Vehicle } from '@/lib/api/vehicle'; 


export function BookingWidget() {
  // --- Global State ---
  const { user } = useAuthStore();

  // --- Local State ---
  const [step, setStep] = useState<'booking' | 'register'>('booking');
  const [bookingType, setBookingType] = useState<'now' | 'later'>('now');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vehicle Data State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isVehiclesLoading, setIsVehiclesLoading] = useState(true);

  const [rideData, setRideData] = useState({
    pickup: '',
    dropoff: '',
    date: '', 
    time: '',
    passengers: '1',
    vehicleType: ''
  });

  // User Registration Data
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: ''
  });

  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  
  // Autocomplete Logic
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  
  // Loading & Debounce State
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false); 
  const [activeField, setActiveField] = useState<'pickup' | 'dropoff' | null>(null);

  const pickupRef = useRef<HTMLDivElement>(null);
  const dropoffRef = useRef<HTMLDivElement>(null);

  // --- Effects ---

  // 1. Fetch Vehicles on Mount
  useEffect(() => {
    const fetchVehicleData = async () => {
      setIsVehiclesLoading(true);
      try {
        const result = await getAllVehicles();
        if (result.success && result.data) {
          setVehicles(result.data);
        }
      } catch (error) {
        console.error("Failed to load vehicles", error);
      } finally {
        setIsVehiclesLoading(false);
      }
    };

    fetchVehicleData();
  }, []);

  // 2. Close suggestions on click outside
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

  // 3. Debounce Logic for Location Search
  useEffect(() => {
    const query = activeField === 'pickup' ? rideData.pickup : rideData.dropoff;

    if (!activeField || !query || query.length < 2) {
      setIsFetchingSuggestions(false);
      return;
    }

    setIsFetchingSuggestions(true);

    const timer = setTimeout(async () => {
      const results = await getLocationSuggestion(query);
      
      if (activeField === 'pickup') {
        setPickupSuggestions(results.length > 0 ? results : ['location not found']);
        setShowPickupSuggestions(true);
      } else {
        setDropoffSuggestions(results.length > 0 ? results: ['location not found'] );
        setShowDropoffSuggestions(true);
      }
      
      setIsFetchingSuggestions(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, [rideData.pickup, rideData.dropoff, activeField]);


  
  const handleInputChange = (field: 'pickup' | 'dropoff', value: string) => {
    setActiveField(field);
    setRideData(prev => ({ ...prev, [field]: value }));
  };

  const handleSuggestionClick = (field: 'pickup' | 'dropoff', value: string) => {
    setRideData(prev => ({ ...prev, [field]: value }));
    setActiveField(null);
    if (field === 'pickup') setShowPickupSuggestions(false);
    else setShowDropoffSuggestions(false);
    handleCalculate();
  };

  const handleCalculate = () => {
    if (rideData.pickup && rideData.dropoff) {
      setEstimatedPrice(85.5); 
    }
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const props = data.features[0].properties;
            const addressParts = [props.name, props.street, props.city, props.state, props.country].filter(Boolean);
            const formattedAddress = addressParts.join(', ');
            setRideData((prev) => ({ ...prev, pickup: formattedAddress }));
          } else {
            setRideData((prev) => ({ ...prev, pickup: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
          }
          handleCalculate();
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          setRideData((prev) => ({ ...prev, pickup: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLoadingLocation(false);
        setShowPickupSuggestions(true);
      }
    );
  };

  const handleMainAction = () => {
    if (!rideData.pickup || !rideData.dropoff) {
      toast.error("Please enter pickup and dropoff locations.");
      return;
    }
    if (bookingType === 'later' && (!rideData.date || !rideData.time)) {
      toast.error("Please select a date and time for your trip.");
      return;
    }
    if (user) {
      submitBooking(user);
    } else {
      if (step === 'booking') {
        setStep('register');
      } else {
        if (!userData.first_name || !userData.last_name || !userData.email || !userData.phone_number) {
          toast.error("Please fill in all contact details.");
          return;
        }
        submitBooking(userData);
      }
    }
  };

  const submitBooking = async (currentUser: any) => {
    setIsSubmitting(true);
    try {
      let finalDate = "";
      let finalTime = "";
      if (bookingType === 'now') {
        const now = new Date();
        finalDate = formatDatePayload(now);
        finalTime = formatTimePayload(now);
      } else {
        finalDate = rideData.date; 
        const [h, m] = rideData.time.split(':');
        const dateObj = new Date();
        dateObj.setHours(Number(h));
        dateObj.setMinutes(Number(m));
        finalTime = formatTimePayload(dateObj);
      }

      const payload: BookingPayload = {
        service_id: "",
        customer_name: `${currentUser.first_name} ${currentUser.last_name}`,
        email: currentUser.email,
        phone: currentUser.phone_number,
        service_type: "chauffeur_ride",
        service_name: "Standard Booking",
        service_description: `Ride from ${rideData.pickup} to ${rideData.dropoff}`,
        pickup_date: finalDate,
        pickup_time: finalTime,
        pickup_location: rideData.pickup,
        dropoff_location: rideData.dropoff,
        passengers: rideData.passengers,
        vehicle_type: rideData.vehicleType,
      };

      await createBooking(payload);
      toast.success("Booking Successful! Check your email for confirmation.");
      
      setStep('booking');
      setRideData({ ...rideData, pickup: '', dropoff: '' });
      setEstimatedPrice(null);

    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-dark-charcoal/95 backdrop-blur-md rounded-2xl p-8 border border-dark-lighter shadow-2xl w-full transition-all duration-300">
      {step === 'register' && (
        <button 
          onClick={() => setStep('booking')}
          className="flex items-center text-grey-medium hover:text-grey-pastel mb-6 text-sm transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Trip Details
        </button>
      )}

      {/* --- STEP 1: BOOKING FORM --- */}
      {step === 'booking' && (
        <>
          {/* Booking Type Toggle */}
          <div className="flex space-x-2 mb-8 bg-dark-lighter p-1 rounded-lg">
            <button
              onClick={() => setBookingType('now')}
              className={`flex-1 py-3 text-base font-medium rounded-md transition-all ${bookingType === 'now' ? 'bg-primary text-black shadow-sm' : 'text-grey-medium hover:text-grey-pastel'}`}
            >
              Book Now
            </button>
            <button
              onClick={() => setBookingType('later')}
              className={`flex-1 py-3 text-base font-medium rounded-md transition-all ${bookingType === 'later' ? 'bg-primary text-black shadow-sm' : 'text-grey-medium hover:text-grey-pastel'}`}
            >
              Book Later
            </button>
          </div>

          <div className="space-y-5">
            {/* Pickup Input */}
            <div className="relative" ref={pickupRef}>
              <MapPinIcon className="absolute left-4 top-4 w-6 h-6 text-primary z-10" />
              <div className="absolute right-4 top-4 z-10">
                {isFetchingSuggestions && activeField === 'pickup' ? (
                  <Loader2Icon className="w-6 h-6 text-primary animate-spin" />
                ) : (
                  <button onClick={getCurrentLocation} disabled={isLoadingLocation} type="button" className="text-grey-medium hover:text-primary transition-colors disabled:opacity-50">
                    <Navigation2Icon className={`w-6 h-6 ${isLoadingLocation ? 'animate-pulse' : ''}`} />
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Pickup Location"
                className="w-full pl-14 pr-14 py-4 text-base rounded-lg bg-dark-lighter border border-grey-muted text-grey-pastel focus:border-primary focus:ring-2 focus:ring-primary placeholder-grey-medium outline-none transition-all"
                value={rideData.pickup}
                onChange={(e) => handleInputChange('pickup', e.target.value)}
              />
              {showPickupSuggestions && pickupSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-charcoal border border-dark-lighter rounded-lg shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto">
                  {pickupSuggestions.map((s, i) => (
                    <button key={i} type="button" onClick={() => handleSuggestionClick('pickup', s)} className="w-full text-left px-4 py-3 hover:bg-dark-lighter text-grey-pastel text-sm border-b border-dark-lighter last:border-0 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropoff Input */}
            <div className="relative" ref={dropoffRef}>
              <MapPinIcon className="absolute left-4 top-4 w-6 h-6 text-red-400 z-10" />
              {isFetchingSuggestions && activeField === 'dropoff' && (
                <div className="absolute right-4 top-4 z-10">
                   <Loader2Icon className="w-6 h-6 text-primary animate-spin" />
                </div>
              )}
              <input
                type="text"
                placeholder="Dropoff Destination"
                className="w-full pl-14 pr-14 py-4 text-base rounded-lg bg-dark-lighter border border-grey-muted text-grey-pastel focus:border-primary focus:ring-2 focus:ring-primary placeholder-grey-medium outline-none transition-all"
                value={rideData.dropoff}
                onChange={(e) => handleInputChange('dropoff', e.target.value)}
              />
              {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-charcoal border border-dark-lighter rounded-lg shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto">
                  {dropoffSuggestions.map((s, i) => (
                    <button key={i} type="button" onClick={() => handleSuggestionClick('dropoff', s)} className="w-full text-left px-4 py-3 hover:bg-dark-lighter text-grey-pastel text-sm border-b border-dark-lighter last:border-0 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date/Time for Book Later */}
            {bookingType === 'later' && (
              <div className="grid grid-cols-2 gap-5">
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-4 w-6 h-6 text-grey-medium" />
                  <input
                    type="date"
                    className="w-full pl-14 pr-4 py-4 text-base rounded-lg bg-dark-lighter border border-grey-muted text-grey-pastel focus:border-primary outline-none"
                    value={rideData.date}
                    onChange={(e) => setRideData({ ...rideData, date: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <ClockIcon className="absolute left-4 top-4 w-6 h-6 text-grey-medium" />
                  <input
                    type="time"
                    className="w-full pl-14 pr-4 py-4 text-base rounded-lg bg-dark-lighter border border-grey-muted text-grey-pastel focus:border-primary outline-none"
                    value={rideData.time}
                    onChange={(e) => setRideData({ ...rideData, time: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Passengers / Vehicle Selection */}
            <div className="grid grid-cols-2 gap-5">
              
              {/* --- DYNAMIC VEHICLE SELECT --- */}
              <div className="relative">
                <CarIcon className="absolute left-4 top-4 w-6 h-6 text-grey-medium" />
                
                {/* Loader for Vehicles */}
                {isVehiclesLoading && (
                  <div className="absolute right-8 top-4 z-10 pointer-events-none">
                    <Loader2Icon className="w-5 h-5 text-primary animate-spin" />
                  </div>
                )}

                <select
                  className={`
                    w-full pl-14 pr-4 py-4 text-base rounded-lg bg-dark-lighter border 
                    border-grey-muted text-grey-pastel focus:border-primary outline-none appearance-none
                    ${isVehiclesLoading ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                  value={rideData.vehicleType}
                  onChange={(e) => setRideData({ ...rideData, vehicleType: e.target.value })}
                  disabled={isVehiclesLoading}
                >
                  <option value="">
                    {isVehiclesLoading ? "Loading Vehicles..." : "Select Vehicle"}
                  </option>
                  
                  {!isVehiclesLoading && vehicles.length > 0 && vehicles.map((vehicle) => (
                    <option key={vehicle.page_id} value={vehicle.title || vehicle.page_id.toString()}>
                       {vehicle.title} {vehicle.capacity ? `(${vehicle.capacity})` : ''}
                    </option>
                  ))}
                </select>
                
              </div>

              {/* Passengers Select */}
              <div className="relative">
                <UsersIcon className="absolute left-4 top-4 w-6 h-6 text-grey-medium" />
                <select
                  className="w-full pl-14 pr-4 py-4 text-base rounded-lg bg-dark-lighter border border-grey-muted text-grey-pastel focus:border-primary outline-none appearance-none"
                  value={rideData.passengers}
                  onChange={(e) => setRideData({ ...rideData, passengers: e.target.value })}
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n} Passengers</option>)}
                </select>
              </div>

            </div>
          </div>
        </>
      )}

      {/* --- STEP 2: USER REGISTRATION FORM --- */}
      {step === 'register' && (
        <div className="space-y-6 animate-fadeIn">
          {/* ... (Existing registration UI remains unchanged) */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-grey-pastel mb-2">One Last Step</h3>
            <p className="text-grey-medium">Please provide your contact details to confirm the booking.</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <UserIcon className="absolute left-4 top-4 w-5 h-5 text-grey-medium" />
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full pl-12 pr-4 py-4 text-base rounded-lg bg-dark-lighter border border-grey-muted text-grey-pastel focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                  value={userData.first_name}
                  onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-4 py-4 text-base rounded-lg bg-dark-lighter border border-grey-muted text-grey-pastel focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                  value={userData.last_name}
                  onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                />
              </div>
            </div>

            <div className="relative">
              <MailIcon className="absolute left-4 top-4 w-5 h-5 text-grey-medium" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 text-base rounded-lg bg-dark-lighter border border-grey-muted text-grey-pastel focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <PhoneIcon className="absolute left-4 top-4 w-5 h-5 text-grey-medium" />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full pl-12 pr-4 py-4 text-base rounded-lg bg-dark-lighter border border-grey-muted text-grey-pastel focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                value={userData.phone_number}
                onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      <Button
        variant="primary"
        fullWidth
        size="lg"
        className="mt-6 py-4 text-base"
        onClick={handleMainAction}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <><Loader2Icon className="animate-spin mr-2" /> Processing...</>
        ) : (
          step === 'booking' 
            ? (bookingType === 'now' ? 'Request Ride Now' : 'Schedule Ride') 
            : 'Confirm & Book Ride'
        )}
      </Button>
    </div>
  );
}