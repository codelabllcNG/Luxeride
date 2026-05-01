
import { useState, useCallback } from 'react';
import { useBookingStore } from '../store/useBookingStore';
import { getTripQuote, requestTrip, cancelTrip } from '../api/trips';
import { Location, VehicleQuote } from '../types/trips';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useRideFlow() {
  const router = useRouter();
  const { 
    pickup, setPickup, 
    dropoff, setDropoff, 
    quote, setQuote, 
    selectedVehicle, setSelectedVehicle,
    activeTrip, setActiveTrip,
    step, setStep,
    reset
  } = useBookingStore();

  const [isLoading, setIsLoading] = useState(false);

  const fetchQuote = useCallback(async (p: Location, d: Location) => {
    setIsLoading(true);
    try {
      const response = await getTripQuote({
        pickup_location: p.address,
        dropoff_location: d.address,
        pickup_lat: p.lat,
        pickup_lng: p.lng,
        dropoff_lat: d.lat,
        dropoff_lng: d.lng
      });

      if (response.status === 'success') {
        console.log("Client-side Quote Data:", response.data);
        setQuote(response.data);
        router.push('/booking/select-vehicle');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch ride quote");
    } finally {
      setIsLoading(false);
    }
  }, [setQuote, setStep]);

  const bookRide = useCallback(async (vehicle: VehicleQuote) => {
    if (!pickup || !dropoff) return;
    
    setIsLoading(true);
    try {
      const response = await requestTrip({
        pickup_location: pickup.address,
        dropoff_location: dropoff.address,
        pickup_lat: pickup.lat,
        pickup_lng: pickup.lng,
        dropoff_lat: dropoff.lat,
        dropoff_lng: dropoff.lng,
        vehicle_id: vehicle.page_id.toString(),
        estimated_price: vehicle.estimated_price,
        service_type: "ride"
      });

      console.log("=== Book Ride Response ===", response);

      if (response.status === 'success') {
        console.log("Trip Data from Response:", response.data);
        setActiveTrip(response.data);
        toast.success("Ride requested successfully!");
        const tripId = response.data?.id || response.data?.trip_id; // Adding fallback just in case
        console.log("Redirecting to trip ID:", tripId);
        router.push(`/booking/ongoing/${tripId}`);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to request ride");
    } finally {
      setIsLoading(false);
    }
  }, [pickup, dropoff, setActiveTrip, router]);

  const handleCancel = useCallback(async () => {
    if (!activeTrip) return;
    
    setIsLoading(true);
    try {
      const response = await cancelTrip(activeTrip.id.toString(), "User cancelled from web app");
      if (response.status === 'success') {
        toast.success("Trip cancelled");
        reset();
        router.push('/');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to cancel trip");
    } finally {
      setIsLoading(false);
    }
  }, [activeTrip, reset, router]);

  return {
    isLoading,
    fetchQuote,
    bookRide,
    handleCancel,
    pickup, setPickup,
    dropoff, setDropoff,
    quote,
    selectedVehicle, setSelectedVehicle,
    activeTrip,
    step, setStep,
    reset
  };
}
