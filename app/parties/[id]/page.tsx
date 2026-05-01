'use client';

import React, { useState, useEffect } from 'react'; // 1. Added useState
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, MapPin, Calendar } from 'lucide-react';
import { getPartyById, PartyBus } from '@/lib/api/parties';
import { PageLoader } from '@/components/shared/PageLoader';
import { BookingModal } from '@/components/marketplace/BookingModal';

export default function PartyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [data, setData] = useState<PartyBus | null>(null);
  
  // 2. State to control Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPartyById(id);
      setData(res.data);
    };
    fetchData();
  }, [id]);

  if (!data) {
    return <PageLoader />;
  }

  const displayImage = typeof data.image_url === 'string' && data?.image_url 
    ? data.image_url 
    : "";

  return (
    <main className="min-h-screen bg-neutral-950 text-grey-pastel">
      
      {/* --- MODAL COMPONENT --- */}
      {/* 3. Render the modal and pass the logic */}
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        vehicle={{
          page_id: id,
          title: `Party: ${data.title}`,
          subheading: data.location || "Luxury Party Bus",
          price: data.price ? `$${data.price}/hr` : "Quote Required"
        } as any}
      />

      {/* --- HEADER IMAGE --- */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/60 z-10" />
        <img src={displayImage} alt={data.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-full z-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
          <span className="bg-[#EAB308] text-black px-3 py-1 rounded text-xs font-bold uppercase tracking-widest mb-4 inline-block">
            Premium Selection
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-grey-pastel shadow-xl">
            {data.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-grey-pastel mb-4">About this Vehicle</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                {data.description || "no description available."}
              </p>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
              <h3 className="text-xl font-bold text-grey-pastel mb-6">Amenities</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.features?.map((feat, i) => (
                  <div key={i} className="flex items-center text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EAB308] mr-3" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
                <div className="mb-6 pb-6 border-b border-neutral-800">
                  <p className="text-gray-400 text-sm">Starting price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-grey-pastel">{data?.price ? `$${data.price}` : "Contact for price"}</span>
                    <span className="text-gray-500">/ hour</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-sm text-gray-300">
                    <Calendar className="w-4 h-4 mr-3 text-[#EAB308]" />
                    <span>{data?.min_booking_hours ? `${data.min_booking_hours} hour minimum booking` : "Min. 4 Hour Booking"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <MapPin className="w-4 h-4 mr-3 text-[#EAB308]" />
                    <span>{data?.location || "Servicing Entire DMV Area"}</span>
                  </div>
                </div>

                {/* 4. Trigger the Modal here */}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#EAB308] text-black font-bold py-4 rounded-xl hover:bg-[#CA8A04] transition mb-3"
                >
                  Request to Book
                </button>
                
                <button onClick={() => router.push('/contact')} className="w-full border border-neutral-700 text-grey-pastel font-bold py-3 rounded-xl hover:bg-neutral-800 transition">
                  Contact Support
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}