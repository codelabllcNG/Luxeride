'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Modal } from '@/components/shared/Modal';
import { Input } from '@/components/shared/Input';
import {
  TruckIcon,
  PackageIcon,
  ClockIcon,
  BuildingIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from 'lucide-react';

const services = [
  {
    icon: TruckIcon,
    title: 'Long-Distance Haulage',
    description:
      'Reliable cargo transport across the DMV region and beyond. Our fleet of trucks handles shipments of all sizes with care and precision.',
    features: [
      'Interstate transport',
      'Full truckload (FTL)',
      'Less than truckload (LTL)',
      'Real-time tracking'
    ]
  },
  {
    icon: PackageIcon,
    title: 'Same-Day Delivery',
    description:
      'When time is critical, our same-day delivery service ensures your packages arrive on schedule. Perfect for urgent business needs.',
    features: [
      '4-hour delivery window',
      'Priority handling',
      'Signature confirmation',
      'Insurance included'
    ]
  },
  {
    icon: ClockIcon,
    title: 'Scheduled Logistics',
    description:
      'Regular pickup and delivery routes tailored to your business schedule. Consistent, reliable service you can count on.',
    features: [
      'Weekly/monthly schedules',
      'Dedicated routes',
      'Volume discounts',
      'Flexible timing'
    ]
  },
  {
    icon: BuildingIcon,
    title: 'Corporate Solutions',
    description:
      'Comprehensive logistics packages designed for businesses. From office relocations to ongoing supply chain management.',
    features: [
      'Custom contracts',
      'Account management',
      'Priority support',
      'Reporting & analytics'
    ]
  }
];

const benefits = [
  {
    icon: ShieldCheckIcon,
    title: 'Fully Insured',
    description: 'Comprehensive coverage for all shipments'
  },
  {
    icon: MapPinIcon,
    title: 'DMV Coverage',
    description: 'DC, Maryland, and Virginia service area'
  },
  {
    icon: ClockIcon,
    title: '24/7 Support',
    description: 'Round-the-clock customer service'
  }
];

export default function LogisticsServicesPage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    cargo: '',
    pickup: '',
    delivery: '',
    date: '',
    service: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const closeModal = () => {
    setIsQuoteModalOpen(false);
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      cargo: '',
      pickup: '',
      delivery: '',
      date: '',
      service: ''
    });
  };

  return (
    <main className="min-h-screen bg-dark pt-20">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-dark-lighter border border-primary/30 mb-6">
              <TruckIcon className="w-4 h-4 text-primary" />
              <span className="text-sm text-grey-pastel">
                Logistics Services
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-grey-pastel mb-6">
              Reliable <span className="text-primary">Logistics</span> Solutions
            </h1>
            <p className="text-xl text-grey-medium mb-8">
              From same-day deliveries to long-distance haulage, we provide
              comprehensive logistics services across the DMV region.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsQuoteModalOpen(true)}
            >
              Request a Quote
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
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
              Our <span className="text-primary">Services</span>
            </h2>
            <p className="text-grey-medium max-w-2xl mx-auto mb-8">
              Comprehensive logistics solutions tailored to your needs. We handle
              everything from single package delivery to complex supply chain
              management.
            </p>


            [Image of logistics supply chain process flowchart]

          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-grey-pastel mb-2">
                        {service.title}
                      </h3>
                      <p className="text-grey-medium mb-4">
                        {service.description}
                      </p>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircleIcon className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm text-grey-medium">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-grey-pastel mb-2">
                  {benefit.title}
                </h3>
                <p className="text-grey-medium">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-dark-charcoal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-grey-pastel mb-4">
              Ready to Get <span className="text-primary">Started</span>?
            </h2>
            <p className="text-grey-medium mb-8 max-w-2xl mx-auto">
              Contact us today for a free quote and discover how Luxeridex can
              streamline your logistics operations.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsQuoteModalOpen(true)}
            >
              Request a Free Quote
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Quote Modal */}
      <Modal
        isOpen={isQuoteModalOpen}
        onClose={closeModal}
        title="Request a Logistics Quote"
        size="lg"
      >
        {isSubmitted ? (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <CheckCircleIcon className="w-20 h-20 text-primary mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-bold text-grey-pastel mb-4">
              Quote Request Received!
            </h3>
            <p className="text-grey-medium mb-8">
              Our logistics team will review your request and contact you within
              24 hours with a detailed quote.
            </p>
            <Button variant="primary" onClick={closeModal}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <Input
                label="Company Name"
                placeholder="Your company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="(202) 555-1234"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
            <Input
              label="Service Type"
              as="select"
              options={services.map((s) => ({
                value: s.title.toLowerCase().replace(/\s+/g, '-'),
                label: s.title
              }))}
              value={formData.service}
              onChange={(e) =>
                setFormData({ ...formData, service: e.target.value })
              }
              placeholder="Select a service"
              required
            />
            <Input
              label="Cargo Description"
              as="textarea"
              placeholder="Describe your cargo (type, size, weight, special requirements)"
              value={formData.cargo}
              onChange={(e) =>
                setFormData({ ...formData, cargo: e.target.value })
              }
              rows={3}
              required
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Pickup Location"
                placeholder="Enter pickup address"
                value={formData.pickup}
                onChange={(e) =>
                  setFormData({ ...formData, pickup: e.target.value })
                }
                required
              />
              <Input
                label="Delivery Location"
                placeholder="Enter delivery address"
                value={formData.delivery}
                onChange={(e) =>
                  setFormData({ ...formData, delivery: e.target.value })
                }
                required
              />
            </div>
            <Input
              label="Preferred Date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
            <Button type="submit" variant="primary" fullWidth size="lg">
              Submit Quote Request
            </Button>
          </form>
        )}
      </Modal>
    </main>
  );
}