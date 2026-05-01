import React from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, CheckIcon } from 'lucide-react';
type PricingTier = {
  name: string;
  duration: string;
  price: string;
  features: string[];
  popular?: boolean;
};
type PricingBandsProps = {
  tiers: PricingTier[];
};
export function PricingBands({
  tiers
}: PricingBandsProps) {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay: 0.2
  }} className="bg-dark-charcoal rounded-xl p-6 border border-dark-lighter">
      <h2 className="text-xl font-semibold text-grey-pastel mb-6">Pricing</h2>

      <div className="space-y-4">
        {tiers.map((tier, index) => <div key={index} className={`
              relative p-4 rounded-xl border transition-all
              ${tier.popular ? 'bg-primary/10 border-primary' : 'bg-dark-lighter border-dark-lighter hover:border-grey-muted'}
            `}>
            {tier.popular && <span className="absolute -top-3 left-4 px-2 py-1 bg-primary text-black text-xs font-semibold rounded">
                Most Popular
              </span>}

            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-grey-pastel">{tier.name}</h3>
                <div className="flex items-center space-x-1 text-grey-medium text-sm">
                  <ClockIcon className="w-4 h-4" />
                  <span>{tier.duration}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {tier.price}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {tier.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-grey-medium">{feature}</span>
                </div>)}
            </div>
          </div>)}
      </div>
    </motion.div>;
}