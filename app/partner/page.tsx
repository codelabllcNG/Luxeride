'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { OnboardingSteps } from '@/components/partner/OnboardingSteps';
import { RegistrationForm } from '@/components/partner/RegistrationForm';
import { DashboardPreview } from '@/components/partner/DashboardPreview';
import { Card } from '@/components/shared/Card';
import {
  UsersIcon,
  DollarSignIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  CheckCircleIcon
} from 'lucide-react';

const benefits = [
  {
    icon: DollarSignIcon,
    title: 'Earn More',
    description:
      "Maximize your vehicle's earning potential with our platform's wide customer reach."
  },
  {
    icon: UsersIcon,
    title: 'Access Customers',
    description:
      'Connect with wedding planners, corporate clients, and event organizers in the DMV.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Payments',
    description:
      'Get paid reliably with our secure payment processing and booking management.'
  },
  {
    icon: TrendingUpIcon,
    title: 'Grow Your Business',
    description:
      'Track performance, manage bookings, and scale your luxury vehicle business.'
  }
];

const requirements = [
  'Vehicle must be 2015 or newer',
  'Valid commercial insurance required',
  'Professional maintenance records',
  'Clean vehicle inspection',
  'Licensed chauffeur (optional)'
];

export default function PartnerPage() {
  return (
    <main className="min-h-screen bg-dark pt-20">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-dark-lighter border border-primary/30 mb-6">
              <UsersIcon className="w-4 h-4 text-primary" />
              <span className="text-sm text-grey-pastel">Partner Program</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-grey-pastel mb-6">
              List Your <span className="text-primary">Limo</span>
            </h1>
            <p className="text-xl text-grey-medium mb-8">
              Join the Luxeride marketplace and start earning from your
              luxury vehicle. Connect with customers across Washington D.C.,
              Maryland, and Virginia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-dark-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OnboardingSteps />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-grey-pastel mb-4">
              Why Partner With <span className="text-primary">Us</span>
            </h2>
            <p className="text-grey-medium max-w-2xl mx-auto">
              Join a growing network of luxury vehicle owners and tap into our
              established customer base.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-grey-pastel mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-grey-medium text-sm">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-dark-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-grey-pastel mb-6">
                Partner <span className="text-primary">Requirements</span>
              </h2>
              <p className="text-grey-medium mb-8">
                To maintain our high standards of service, we have a few
                requirements for vehicles listed on our marketplace.
              </p>
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-grey-pastel">{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-dark p-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    15%
                  </div>
                  <div className="text-grey-pastel font-semibold mb-4">
                    Commission Rate
                  </div>
                  <p className="text-grey-medium text-sm mb-6">
                    We only charge a small commission on successful bookings. No
                    listing fees, no monthly charges.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-dark-charcoal">
                      <div className="text-2xl font-bold text-grey-pastel">
                        $0
                      </div>
                      <div className="text-xs text-grey-medium">
                        Listing Fee
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-dark-charcoal">
                      <div className="text-2xl font-bold text-grey-pastel">
                        $0
                      </div>
                      <div className="text-xs text-grey-medium">
                        Monthly Fee
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-24 bg-dark" id="register">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-grey-pastel mb-4">
              Ready to <span className="text-primary">Get Started</span>?
            </h2>
            <p className="text-grey-medium max-w-2xl mx-auto">
              Fill out the form below to apply for our partner program. Our team
              will review your application within 2-3 business days.
            </p>
          </motion.div>

          <RegistrationForm />


          [Image of dashboard interface mockup]

          <DashboardPreview />
        </div>
      </section>
    </main>
  );
}