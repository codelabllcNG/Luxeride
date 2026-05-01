
import { create } from 'zustand';
import { Location, TripQuote, VehicleQuote, Trip } from '../types/trips';

interface BookingState {
  pickup: Location | null;
  dropoff: Location | null;
  quote: TripQuote | null;
  selectedVehicle: VehicleQuote | null;
  activeTrip: Trip | null;
  step: number;
  isModalOpen: boolean;
  
  setPickup: (loc: Location | null) => void;
  setDropoff: (loc: Location | null) => void;
  setQuote: (quote: TripQuote | null) => void;
  setSelectedVehicle: (vehicle: VehicleQuote | null) => void;
  setActiveTrip: (trip: Trip | null) => void;
  setStep: (step: number) => void;
  setModalOpen: (open: boolean) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  pickup: null,
  dropoff: null,
  quote: null,
  selectedVehicle: null,
  activeTrip: null,
  step: 1,
  isModalOpen: false,

  setPickup: (pickup) => set({ pickup }),
  setDropoff: (dropoff) => set({ dropoff }),
  setQuote: (quote) => set({ quote }),
  setSelectedVehicle: (selectedVehicle) => set({ selectedVehicle }),
  setActiveTrip: (activeTrip) => set({ activeTrip }),
  setStep: (step) => set({ step }),
  setModalOpen: (isModalOpen) => set({ isModalOpen }),
  
  reset: () => set({
    pickup: null,
    dropoff: null,
    quote: null,
    selectedVehicle: null,
    activeTrip: null,
    step: 1,
    isModalOpen: false
  })
}));
