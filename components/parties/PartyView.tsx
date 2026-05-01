
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { PartyBusCard } from '@/components/parties/PartyBusCard';
import { GroupBookingCalculator } from '@/components/parties/GroupBookingCalculator';
import { Button } from '@/components/shared/Button';
import { PartiesPageData } from '@/lib/api/parties';
import { useRouter } from 'next/navigation';

interface PartyViewProps {
  initialData: PartiesPageData;
}

export default function PartyView({ initialData }: PartyViewProps) {
  const { hero_section, party_fleet_section, parties_section } = initialData;
  const router = useRouter();
  const packages = [
    { title: 'Bachelor/Bachelorette', price: '$800', desc: '4 hours, champagne included, VIP club entry' },
    { title: 'Birthday Bash', price: '$600', desc: '3 hours, decorations, soft drinks included' },
    { title: 'Prom Night', price: '$1200', desc: '6 hours, split payment available, red carpet' },
    { title: 'Winery Tour', price: '$900', desc: '5 hours, visits to 3 wineries, picnic lunch' }
  ];

  return (
    <main className="min-h-screen bg-dark pt-20">
      {/* Hero Section */}
      <section className="relative py-24 h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-r  from-black/90 to-black/40 z-10" />
          <img
            src={hero_section.background_image}
            alt="Party Bus Hero"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl mt-16 sm:text-6xl font-bold text-grey-pastel mb-6">
              {hero_section.heading}
            </h1>
            <p className="text-xl text-grey-pastel mb-8">
              {hero_section.subheading}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" onClick={() => router.push('/limo-booking')} size="lg">View Fleet</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Dynamic Fleet List */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-grey-pastel">
                    {party_fleet_section.heading}
                  </h2>
                  <p className="text-grey-medium">
                    {party_fleet_section.subheading}
                  </p>
                </div>
              </div>

              {parties_section.map((bus) => (
                <PartyBusCard
                  key={bus.page_id}
                  id={bus.page_id}
                  name={bus.title}
                  images={bus.image_url as string}
                  // Defaulting capacity/price since they aren't in your API response yet
                  capacity={20}
                  pricePerHour={250}
                  rating={bus.rating}
                  description={bus.description}
                  onReserve={() => console.log('Reserve', bus.title)}
                />
              ))}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 mt-24 space-y-8">
              <h3 className="text-2xl font-bold text-grey-pastel mb-5">
                Party Packages
              </h3>
              <div className="bg-dark-charcoal rounded-xl p-6 border border-dark-lighter">

                <div className="space-y-4">
                  {packages.map((pkg, i) => (
                    <div
                      key={i}
                      className="border-b border-dark-lighter pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between font-bold text-grey-pastel">
                        <span>{pkg.title}</span>
                        <span className="text-primary">{pkg.price}</span>
                      </div>
                      <p className="text-sm text-grey-medium mt-1">
                        {pkg.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}