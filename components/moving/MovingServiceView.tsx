'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MovingQuoteForm } from '@/components/moving/MovingQuoteForm';
import { Card } from '@/components/shared/Card';
import { CheckCircleIcon, BoxIcon, TruckIcon, ShieldIcon } from 'lucide-react';
import { MovingPageData } from '@/lib/api/moving';
import { useRouter } from 'next/navigation';
import { BookingModal } from '@/components/marketplace/BookingModal';
import { ApiVehicle } from '@/components/marketplace/VehicleCard';

interface MovingServicesViewProps {
  data: MovingPageData;
}

export default function MovingServicesView({ data }: MovingServicesViewProps) {
  const router = useRouter()
  const { hero } = data;
  const servicesSection = data.our_services[0]; 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<ApiVehicle | null>(null);

  const handleSelectPackage = (pkg: any) => {
    const apiVehicle: ApiVehicle = {
      page_id: Math.floor(Math.random() * 1000000), // temp id for package
      title: 'Moving Services',
      subheading: pkg.name,
      image_url: "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=800&h=600&fit=crop",
      image_title: pkg.name,
      price: pkg.price.replace('From $', ''),
      capacity: 'N/A',
      rating: '5.0',
      link: '#',
      description: pkg.features.join(', ')
    };
    setSelectedPackage(apiVehicle);
    setIsModalOpen(true);
  };

  const bgImage = hero.background_image || "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=1920&h=1080&fit=crop";

  return (
    <main className="min-h-screen bg-dark pt-20">
      
      {/* --- HERO SECTION (Dynamic) --- */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-r from-black/90 to-black/50 z-10" />
          <img
            src={bgImage}
            alt="Moving Truck"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold text-grey-pastel mb-6">
                {hero.heading}
              </h1>
              <p className="text-xl text-grey-pastel mb-8">
                {hero.subheading}
              </p>
              
              {/* Static Trust Badges */}
              <div className="flex items-center space-x-6 text-grey-pastel">
                <div className="flex items-center">
                  <ShieldIcon className="w-5 h-5 text-primary mr-2" />
                  Licensed & Insured
                </div>
                <div className="flex items-center">
                  <TruckIcon className="w-5 h-5 text-primary mr-2" />
                  Modern Fleet
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <MovingQuoteForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION (Dynamic) --- */}
      <section className="py-16 bg-dark-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mt-16 text-3xl font-bold text-grey-pastel mb-4">
              {servicesSection?.heading || "Our Services"}
            </h2>
            <p className="text-grey-medium">
              {servicesSection?.subheading}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {servicesSection?.cards.map((service, i) => (
              <Card
                key={i}
                className="hover:border-primary/50 transition-colors"
              >
                <BoxIcon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold text-grey-pastel mb-2">
                  {service.title}
                </h3>
                <p className="text-grey-medium">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- PACKAGES SECTION (Static / Hardcoded) --- */}
      <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-grey-pastel mb-12 text-center">
            Moving Packages
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Basic Move',
                price: 'From $499',
                features: ['Loading & Unloading', 'Transport', 'Basic Insurance', 'Furniture Protection']
              },
              {
                name: 'Standard Move',
                price: 'From $899',
                features: ['Loading & Unloading', 'Transport', 'Full Value Protection', 'Furniture Disassembly', 'Wardrobe Boxes']
              },
              {
                name: 'Premium Move',
                price: 'From $1499',
                features: ['Full Packing Service', 'Loading & Unloading', 'Transport', 'Unpacking Service', 'Debris Removal', 'Cleaning Service']
              }
            ].map((pkg, i) => (
              <div
                key={i}
                className={`bg-dark-charcoal rounded-xl p-8 border ${
                  i === 1
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-dark-lighter'
                }`}
              >
                {i === 1 && (
                  <div className="text-primary text-xs font-bold uppercase tracking-wider mb-2">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-grey-pastel mb-2">
                  {pkg.name}
                </h3>
                <div className="text-3xl font-bold text-primary mb-6">
                  {pkg.price}
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-grey-medium"
                    >
                      <CheckCircleIcon className="w-4 h-4 text-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-bold transition-colors ${
                    i === 1
                      ? 'bg-primary text-black'
                      : 'bg-dark-lighter text-grey-pastel hover:bg-primary hover:text-black'
                  }`}
                  onClick={() => handleSelectPackage(pkg)}
                >
                  Select Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        vehicle={selectedPackage} 
      />
    </main>
  );
}