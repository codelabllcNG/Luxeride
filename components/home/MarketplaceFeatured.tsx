'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '../shared/Card';
import { StarIcon, UsersIcon } from 'lucide-react';

export type FeaturedVehicle = {
  id: number;
  title: string | null;
  subheading: string | null;
  image_url: string;
  image_title: string;
  price: string | null;
  capacity: string | null;
  rating: string;
  link: string;
};

type MarketplaceFeaturedProps = {
  vehicles: FeaturedVehicle[] | null;
};

export function MarketplaceFeatured({ vehicles }: MarketplaceFeaturedProps) {
  if (!vehicles || vehicles.length === 0) return null;

  return (
    <section className="py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.link || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/limo-booking/${vehicle.id}`} className="block h-full">
                <Card hoverable padding="none" className="overflow-hidden h-full">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={vehicle.image_url || '/placeholder.png'}
                      alt={vehicle.title || 'Vehicle'}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="
                          px-2 py-1 rounded-md text-xs font-medium
                          bg-dark-lighter text-grey-pastel border border-grey-muted
                        "
                      >
                        Marketplace
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 rounded-md bg-dark/80 backdrop-blur-sm">
                      <StarIcon className="w-4 h-4 text-primary fill-primary" />
                      <span className="text-sm font-medium text-grey-pastel">
                        {vehicle.rating || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <span className="text-xs text-primary font-medium">
                      {vehicle.subheading || 'Vehicle'}
                    </span>
                    <h3 className="text-lg font-semibold text-grey-pastel mt-1 mb-2">
                      {vehicle.title || 'Unknown Vehicle'}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold">
                        {vehicle.price ? `$${vehicle.price}` : 'Contact us'}
                      </span>
                      <div className="flex items-center space-x-1 text-grey-medium">
                        <UsersIcon className="w-4 h-4" />
                        <span className="text-sm">{vehicle.capacity || '-'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}