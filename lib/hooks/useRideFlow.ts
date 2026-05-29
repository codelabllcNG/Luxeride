
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
    serviceType, setServiceType,
    hours, setHours,
    reset
  } = useBookingStore();

  const [isLoading, setIsLoading] = useState(false);

  const fetchQuote = useCallback(async (p: Location, d: Location | null) => {
    setIsLoading(true);
    try {
      const payload: any = {
        service_type: serviceType,
        pickup_location: p.address,
        pickup_lat: p.lat,
        pickup_lng: p.lng,
      };

      if (serviceType === 'hourly') {
        payload.hours = hours;
        if (d) {
          payload.dropoff_location = d.address;
          payload.dropoff_lat = d.lat;
          payload.dropoff_lng = d.lng;
        }
      } else {
        if (!d) return;
        payload.dropoff_location = d.address;
        payload.dropoff_lat = d.lat;
        payload.dropoff_lng = d.lng;
      }

      const response = await getTripQuote(payload);

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
  }, [serviceType, hours, setQuote, router]);

  const bookRide = useCallback(async (
    vehicle: VehicleQuote,
    pickupDatetime?: string,
    passengers?: number,
    notes?: string
  ) => {
    if (!pickup || (serviceType === 'ride' && !dropoff)) return;
    
    setIsLoading(true);
    try {
      const payload: any = {
        pickup_location: pickup.address,
        pickup_lat: pickup.lat,
        pickup_lng: pickup.lng,
        vehicle_id: vehicle.page_id.toString(),
        estimated_price: vehicle.estimated_price,
        service_type: serviceType
      };

      if (dropoff) {
        payload.dropoff_location = dropoff.address;
        payload.dropoff_lat = dropoff.lat;
        payload.dropoff_lng = dropoff.lng;
      }

      if (serviceType === 'hourly') {
        payload.hours = hours;
        if (pickupDatetime) payload.pickup_datetime = pickupDatetime;
        if (passengers) payload.passengers = passengers;
        if (notes) payload.notes = notes;
      }

      const response = await requestTrip(payload);

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
    serviceType, setServiceType,
    hours, setHours,
    reset
  };
}
