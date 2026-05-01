'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../shared/Button';
import {
  CarIcon,
  StoreIcon,
  CalendarIcon,
  TruckIcon,
  PackageIcon,
  ClockIcon,
  BuildingIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { useBookingStore } from '@/lib/store/useBookingStore';

type ServiceItem = {
  title: string;
  description: string;
};

type ServiceSplitProps = {
  services: {
    limo_card: ServiceItem[];
    logistics_card: ServiceItem[];
  };
};

const limoIconMap = [CarIcon, StoreIcon, CalendarIcon];
const logisticsIconMap = [TruckIcon, PackageIcon, ClockIcon, BuildingIcon];

export function ServiceSplit({ services }: ServiceSplitProps) {
  const { setModalOpen } = useBookingStore();
  return (
    <section className="py-24 bg-dark-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-grey-pastel mb-4">
            Two Ways to <span className="text-primary">Serve You</span>
          </h2>
          <p className="text-grey-medium max-w-2xl mx-auto">
            Whether you need luxury transportation or reliable logistics, we've
            got you covered.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* ================= LIMO ================= */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-dark rounded-2xl p-8 border border-dark-lighter"
          >
            <div className="flex flex-col items-center text-center space-y-4 sm:flex-row sm:items-center sm:text-left sm:space-y-0 sm:space-x-4 mb-8">
              <div className="p-3 rounded-xl bg-primary/10 w-fit">
                <CarIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-grey-pastel">
                  Book a Limo Ride
                </h3>
                <p className="text-grey-medium text-sm sm:text-base">
                  Premium vehicles for every occasion
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {services.limo_card.map((service, index) => {
                const Icon = limoIconMap[index] ?? CarIcon;
                const isBookNow = service.title === "Book Now";

                const content = (
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-dark-charcoal hover:bg-dark-lighter transition-colors group cursor-pointer w-full">
                    <div className="p-2 rounded-lg bg-dark-lighter group-hover:bg-primary/10 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-grey-pastel group-hover:text-primary transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-sm text-grey-medium">
                        {service.description}
                      </p>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-grey-medium group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                );

                if (isBookNow) {
                  return (
                    <button
                      key={index}
                      onClick={() => setModalOpen(true)}
                      className="block w-full focus:outline-none"
                    >
                      {content}
                    </button>
                  );
                }

                return (
                  <Link
                    key={index}
                    href="/limo-booking"
                    className="block w-full"
                  >
                    {content}
                  </Link>
                );
              })}
            </div>

            <Button 
              onClick={() => setModalOpen(true)}
              variant="primary" 
              className='cursor-pointer' 
              fullWidth
            >
              Book Your Ride Now
            </Button>
          </motion.div>

          {/* ================= LOGISTICS ================= */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-dark rounded-2xl p-8 border border-dark-lighter"
          >
            <div className="flex flex-col items-center text-center space-y-4 sm:flex-row sm:items-center sm:text-left sm:space-y-0 sm:space-x-4 mb-8">
              <div className="p-3 rounded-xl bg-primary/10 w-fit">
                <TruckIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-grey-pastel">
                  Transport & Logistics
                </h3>
                <p className="text-grey-medium text-sm sm:text-base">
                  Reliable cargo movement solutions
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {services.logistics_card.map((service, index) => {
                const Icon = logisticsIconMap[index] ?? TruckIcon;

                return (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-xl bg-dark-charcoal"
                  >
                    <div className="p-2 rounded-lg bg-dark-lighter">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-grey-pastel">
                        {service.title}
                      </h4>
                      <p className="text-sm text-grey-medium">
                        {service.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link href="/logistics" className="block">
              <Button variant="outline" className='cursor-pointer' fullWidth>
                Request a Quote
              </Button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}