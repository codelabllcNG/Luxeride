"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { listenToDriverLocation, listenToTripStatus } from '@/lib/firebase';
import { useBookingStore } from '@/lib/store/useBookingStore';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Phone, MessageSquare, Shield, Star, Navigation, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import L from 'leaflet';
import { PaymentModal } from './PaymentModal';

export function TripTracking() {
  const { activeTrip, setActiveTrip, pickup, dropoff, reset } = useBookingStore();
  const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number, rotation: number } | null>(null);
  const [tripStatus, setTripStatus] = useState<string>('pending');
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePayment = async () => {
    if (!activeTrip || activeTrip.payment_status === 'paid') return;
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (!activeTrip) return;
    setIsPaymentModalOpen(false);
    // Refresh trip data to reflect paid status
    setActiveTrip({
      ...activeTrip,
      payment_status: 'paid'
    });
  };

  // Sync status when activeTrip loads
  useEffect(() => {
    if (activeTrip?.status) {
      console.log("=== TripTracking Active State ===", {
        id: activeTrip.id,
        status: activeTrip.status,
        payment: activeTrip.payment_status
      });
      setTripStatus(activeTrip.status);
    }
  }, [activeTrip?.status, activeTrip]);

  // Get current user location from browser as fallback
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => {},
        { enableHighAccuracy: true }
      );
    }
  }, []);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const driverMarker = useRef<L.Marker | null>(null);
  const pickupMarker = useRef<L.Marker | null>(null);
  const routePolyline = useRef<L.Polyline | null>(null);

  // --- Map Initialization ---
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || !activeTrip || leafletMap.current) return;

    // Fix for default marker icons in Leaflet with Next.js
    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    // Resolve pickup coordinates: API -> Store -> Browser Fallback -> Default
    const pLat = activeTrip.pickup_lat || pickup?.lat || userLocation?.lat || 9.05785;
    const pLng = activeTrip.pickup_lng || pickup?.lng || userLocation?.lng || 7.49508;

    const center: [number, number] = [pLat, pLng];

    leafletMap.current = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView(center, 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(leafletMap.current);

    // Pickup Marker
    pickupMarker.current = L.marker(center).addTo(leafletMap.current)
      .bindPopup('Pickup Location');

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [activeTrip?.id, userLocation]);

  // --- Routing Logic ---
  useEffect(() => {
    let targetLat: number | undefined;
    let targetLng: number | undefined;

    if (tripStatus === 'ongoing') {
      targetLat = activeTrip?.dropoff_lat || dropoff?.lat;
      targetLng = activeTrip?.dropoff_lng || dropoff?.lng;
    } else {
      targetLat = activeTrip?.pickup_lat || pickup?.lat || userLocation?.lat;
      targetLng = activeTrip?.pickup_lng || pickup?.lng || userLocation?.lng;
    }

    if (!leafletMap.current || !driverLocation || !targetLat || !targetLng) return;

    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${driverLocation.lng},${driverLocation.lat};${targetLng},${targetLat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        
        if (data.routes && data.routes[0]) {
          const coordinates = data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
          
          if (routePolyline.current) {
            routePolyline.current.setLatLngs(coordinates);
          } else {
            routePolyline.current = L.polyline(coordinates, {
              color: '#EAB308',
              weight: 4,
              opacity: 0.8,
              lineJoin: 'round',
              dashArray: '10, 10', // Dashed line for "on the way"
            }).addTo(leafletMap.current!);
          }
          
          // Adjust zoom to show both if it's the first time
          const map = leafletMap.current;
          const polyline = routePolyline.current;
          if (data.routes[0].distance > 500 && map && polyline) {
             map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
          }
        }
      } catch (error) {
        console.error("Routing error:", error);
      }
    };

    if (tripStatus === 'accepted' || tripStatus === 'arriving' || tripStatus === 'ongoing') {
      fetchRoute();
    } else if (routePolyline.current) {
      routePolyline.current.remove();
      routePolyline.current = null;
    }
  }, [driverLocation, activeTrip?.pickup_lat, activeTrip?.dropoff_lat, tripStatus, pickup?.lat, dropoff?.lat, userLocation?.lat]);

  // --- Real-time Listeners ---
  useEffect(() => {
    if (!activeTrip?.id) return;

    const unsubStatus = listenToTripStatus(activeTrip.id.toString(), (status) => {
      setTripStatus(status);
      if (status === 'completed') {
        toast.success("Trip completed! Hope you enjoyed your ride.");
      }
    });

    const unsubLocation = listenToDriverLocation(activeTrip.id.toString(), (loc) => {
      setDriverLocation(loc);
      
      if (leafletMap.current) {
        const pos: [number, number] = [loc.lat, loc.lng];
        
        if (!driverMarker.current) {
          const carIcon = L.divIcon({
            html: `<div style="transform: rotate(${loc.rotation}deg)">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="#EAB308" stroke="black" stroke-width="1.5"/>
              </svg>
            </div>`,
            className: 'driver-car-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          });
          
          driverMarker.current = L.marker(pos, { icon: carIcon }).addTo(leafletMap.current);
        } else {
          driverMarker.current.setLatLng(pos);
          const icon = driverMarker.current.getIcon() as L.DivIcon;
          if (icon && icon.options) {
             driverMarker.current.setIcon(L.divIcon({
                ...icon.options,
                html: `<div style="transform: rotate(${loc.rotation}deg)">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="#EAB308" stroke="black" stroke-width="1.5"/>
                  </svg>
                </div>`
             }));
          }
        }
      }
    });

    return () => {
      unsubLocation();
      unsubStatus();
    };
  }, [activeTrip?.id]);

  if (!activeTrip) return null;

  return (
    <div className="space-y-6">
      <div className="relative h-[450px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-dark">
        <div ref={mapRef} className="w-full h-full z-0" />
        
  
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
           <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 pointer-events-auto">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{tripStatus} </span>
           </div>
        </div>
      </div>

      <Card className="bg-dark-charcoal/90 backdrop-blur-xl border-white/10 border-t-4 border-t-primary">
         <div className="p-6">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center space-x-4">
                  <div className="relative">
                     <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 bg-dark-lighter">
                        <img 
                          src={activeTrip.driver?.avatar || "https://i.pravatar.cc/150?u=driver"} 
                          alt="Driver" 
                          className="w-full h-full object-cover" 
                        />
                     </div>
                     <div className="absolute -bottom-1 -right-1 bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center">
                        4.9 <Star className="w-2 h-2 ml-0.5 fill-black" />
                     </div>
                  </div>
                  <div>
                     <h4 className="text-lg font-bold text-grey-pastel">{activeTrip.driver?.name || "Searching..."}</h4>
                     <p className="text-xs text-grey-medium">
                       {activeTrip.driver?.car_model || "Luxury Vehicle"} • {activeTrip.driver?.license_plate || "LUX-RIDE"}
                     </p>
                  </div>
               </div>
               <div className="flex space-x-2">
                  <button className="p-3 bg-white/5 rounded-full border border-white/10 text-grey-pastel hover:bg-primary hover:text-black transition-all">
                     <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-white/5 rounded-full border border-white/10 text-grey-pastel hover:bg-primary hover:text-black transition-all">
                     <MessageSquare className="w-5 h-5" />
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] uppercase font-bold text-grey-dark tracking-widest mb-1">Estimated Fare</p>
                  <p className="text-xl font-bold text-primary">${activeTrip.estimated_price}</p>
               </div>
                <button 
                  onClick={handlePayment}
                  disabled={isPaying || activeTrip.payment_status === 'paid' || activeTrip.payment_status === 'authorized'}
                  className={`p-4 rounded-2xl border transition-all text-left w-full ${
                    (activeTrip.payment_status === 'paid' || activeTrip.payment_status === 'authorized')
                      ? 'bg-green-500/10 border-green-500/20 opacity-80' 
                      : 'bg-primary/10 border-primary/20 hover:bg-primary/20 cursor-pointer'
                  }`}
                >
                   <p className="text-[10px] uppercase font-bold text-grey-dark tracking-widest mb-1">Payment Status</p>
                   <p className={`text-sm font-medium flex items-center ${
                     (activeTrip.payment_status === 'paid' || activeTrip.payment_status === 'authorized') ? 'text-green-500' : 'text-primary'
                   }`}>
                      {(activeTrip.payment_status === 'paid' || activeTrip.payment_status === 'authorized') ? (
                        <>
                          <Shield className="w-3.5 h-3.5 mr-1.5" />
                          Paid Securely
                        </>
                      ) : (
                        <>
                          {isPaying ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Shield className="w-3.5 h-3.5 mr-1.5" />}
                          Pay Now (${activeTrip.estimated_price})
                        </>
                      )}
                   </p>
                </button>
            </div>

            <Button 
              variant="ghost" 
              className="w-full mt-6 text-red-500 hover:bg-red-500/10" 
              size="sm"
              onClick={() => {
                // handleCancel logic should be hooked up here
                toast.info("Cancellation requested...");
              }}
            >
               Cancel Trip
            </Button>
         </div>
      </Card>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        tripId={activeTrip.id.toString()}
        amount={activeTrip.estimated_price}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
