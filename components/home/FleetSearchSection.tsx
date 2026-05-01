'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { SearchIcon } from 'lucide-react';

const vehicleStyles = [
  { value: '', label: 'All Styles' },
  { value: 'stretch', label: 'Stretch Limo' },
  { value: 'suv', label: 'Luxury SUV' },
  { value: 'party-bus', label: 'Party Bus' },
  { value: 'sedan', label: 'Luxury Sedan' },
  { value: 'vintage', label: 'Vintage/Classic' }
];

const capacityOptions = [
  { value: '', label: 'Any Capacity' },
  { value: '2-4', label: '2-4 Passengers' },
  { value: '5-8', label: '5-8 Passengers' },
  { value: '9-14', label: '9-14 Passengers' },
  { value: '15+', label: '15+ Passengers' }
];

const locationOptions = [
  { value: '', label: 'All Locations' },
  { value: 'dc', label: 'Washington D.C.' },
  { value: 'md', label: 'Maryland' },
  { value: 'va', label: 'Virginia' }
];

const listingTypes = [
  { value: '', label: 'All Listings' },
  { value: 'company', label: 'Company Owned' },
  { value: 'marketplace', label: 'Marketplace' }
];

export function FleetSearchSection() {
  const router = useRouter();
  
  const [filters, setFilters] = useState({
    date: '',
    style: '',
    capacity: '',
    location: '',
    listingType: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct query parameters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    // In Next.js, we use router.push for navigation
    router.push(`/marketplace?${params.toString()}`);
  };

  return (
    <section className="py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-grey-pastel mb-4">
            Find Your <span className="text-primary">Perfect Ride</span>
          </h2>
          <p className="text-grey-medium max-w-2xl mx-auto">
            Search our fleet of premium vehicles and marketplace listings to
            find the perfect transportation for your needs.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <form
            onSubmit={handleSearch}
            className="bg-dark-charcoal rounded-2xl p-6 md:p-8 border border-dark-lighter"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <Input
                label="Availability Date"
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
              />
              <Input
                label="Vehicle Style"
                as="select"
                options={vehicleStyles}
                value={filters.style}
                onChange={(e) =>
                  setFilters({ ...filters, style: e.target.value })
                }
              />
              <Input
                label="Passenger Capacity"
                as="select"
                options={capacityOptions}
                value={filters.capacity}
                onChange={(e) =>
                  setFilters({ ...filters, capacity: e.target.value })
                }
              />
              <Input
                label="Location"
                as="select"
                options={locationOptions}
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
              />
              <Input
                label="Listing Type"
                as="select"
                options={listingTypes}
                value={filters.listingType}
                onChange={(e) =>
                  setFilters({ ...filters, listingType: e.target.value })
                }
              />
            </div>
            <Button type="submit" variant="primary" size="lg" fullWidth>
              <SearchIcon className="w-5 h-5 mr-2" />
              Search Vehicles
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}