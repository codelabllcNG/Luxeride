'use client';

import React, { useState } from 'react'; // Added useState
import { motion } from 'framer-motion';
import { EquipmentCard } from './EquipmentCard'; 
import { Button } from '@/components/shared/Button';
import { CheckCircleIcon, TruckIcon, ShieldCheckIcon } from 'lucide-react';
import { MobilityPageData, EquipmentItem } from '@/lib/api/mobility';
// Import the new Modal component
import { EquipmentBookingModal } from './EquipmentBookingModal';

interface MobilityViewProps {
  pageData: MobilityPageData;
  equipmentList: EquipmentItem[];
}

export default function MobilityView({ pageData, equipmentList }: MobilityViewProps) {
  const { hero, why_choose_us } = pageData;

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

  const getIcon = (title: string) => {
    if (title.includes('Delivery')) return TruckIcon;
    if (title.includes('Clean')) return ShieldCheckIcon;
    return CheckCircleIcon;
  };

  // --- Handlers ---
  const handleReserveClick = (item: EquipmentItem) => {
    setSelectedEquipment({
      name: item.title,
      dailyRate: Number(item.price_per_day),
      weeklyRate: Number(item.price_per_week),
      image: item.image_url
    });
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-dark pt-20">
      
      {/* Hero Section */}
      <section className="bg-dark-charcoal py-16 border-b border-dark-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-4xl mt-16 sm:text-5xl font-bold text-grey-pastel mb-6">
                {hero.heading}
              </h1>
              <p className="text-xl text-grey-medium mb-8">{hero.subheading}</p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Browse Catalog
                </Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <img 
                src={hero.background_image} 
                alt="Mobility Equipment" 
                className="rounded-2xl shadow-xl w-full h-auto border border-dark-lighter"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {why_choose_us.map((item, index) => {
              const Icon = getIcon(item.title);
              return (
                <div key={index} className="flex items-start space-x-4 p-6 bg-dark-charcoal rounded-xl border border-dark-lighter">
                  <Icon className="w-8 h-8 text-primary shrink-0" />
                  <div>
                    <h3 className="font-bold text-grey-pastel mb-2">{item.title}</h3>
                    <p className="text-sm text-grey-medium">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Equipment Catalog */}
      <section id="catalog" className="py-16 bg-dark-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-grey-pastel mb-12 text-center">
            Equipment Catalog
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipmentList.map((item) => (
              <EquipmentCard
                key={item.page_id}
                name={item.title}
                image={item.image_url}
                description={item.description}
                dailyRate={Number(item.price_per_day)}  
                weeklyRate={Number(item.price_per_week)} 
                specs={item.features.map(f => f.title)} 
                // Pass the new handler here
                onReserve={() => handleReserveClick(item)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- RENDER MODAL --- */}
      <EquipmentBookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        equipment={selectedEquipment}
      />
    </main>
  );
}