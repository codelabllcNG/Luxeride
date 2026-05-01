import React from 'react';
import { motion } from 'framer-motion';
import { UserPlusIcon, CarIcon, CalendarCheckIcon, ArrowRightIcon } from 'lucide-react';
const steps = [{
  icon: UserPlusIcon,
  title: 'Create Profile',
  description: 'Sign up and complete your owner profile with basic information',
  step: 1
}, {
  icon: CarIcon,
  title: 'Upload Vehicle Details',
  description: 'Add your vehicle information, photos, pricing, and availability',
  step: 2
}, {
  icon: CalendarCheckIcon,
  title: 'Start Getting Bookings',
  description: 'Receive booking requests and grow your business with Luxeridex',
  step: 3
}];
export function OnboardingSteps() {
  return <div className="py-16">
    <motion.div initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.6
    }} className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-grey-pastel mb-4">
        How It <span className="text-primary">Works</span>
      </h2>
      <p className="text-grey-medium max-w-2xl mx-auto">
        Join our marketplace in three simple steps and start earning from your
        luxury vehicle.
      </p>
    </motion.div>

    <div className="grid md:grid-cols-3 gap-8 relative">
      {/* Connection Lines (Desktop) */}
      <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-primary to-primary opacity-30" />

      {steps.map((step, index) => <motion.div key={step.step} initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6,
        delay: index * 0.2
      }} className="relative text-center">
        {/* Step Number */}
        <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full bg-dark-charcoal border-2 border-primary mb-6">
          <step.icon className="w-12 h-12 text-primary" />
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-black font-bold text-sm flex items-center justify-center">
            {step.step}
          </div>
        </div>

        {/* Arrow (Mobile) */}
        {index < steps.length - 1 && <div className="md:hidden flex justify-center my-4">
          <ArrowRightIcon className="w-6 h-6 text-primary rotate-90" />
        </div>}

        <h3 className="text-xl font-semibold text-grey-pastel mb-3">
          {step.title}
        </h3>
        <p className="text-grey-medium text-sm max-w-xs mx-auto">
          {step.description}
        </p>
      </motion.div>)}
    </div>
  </div>;
}