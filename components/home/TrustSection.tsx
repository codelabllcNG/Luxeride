'use client';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  UserCheckIcon,
  BadgeCheckIcon,
  AwardIcon
} from 'lucide-react';


export type WhyChooseUsFeature = {
  feature_card_title: string;
  feature_card_subheading: string;
};
type TrustSectionProps = {
  features: WhyChooseUsFeature[];
};
const icons = [ShieldCheckIcon, UserCheckIcon, BadgeCheckIcon, AwardIcon];
export function TrustSection({ features }: TrustSectionProps) {
  if (!features || features.length === 0) return null;

  return (
    <section className="py-24 bg-dark-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-grey-pastel mb-4">
            Why Choose <span className="text-primary">Luxeridex</span>
          </h2>
          <p className="text-grey-medium max-w-2xl mx-auto">
            We're committed to providing safe, reliable, and luxurious
            transportation services you can trust.
          </p>
        </motion.div>

        {/* Trust Badges Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = icons[index] ?? ShieldCheckIcon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-grey-pastel mb-3">
                  {feature.feature_card_title}
                </h3>
                <p className="text-grey-medium text-sm">
                  {feature.feature_card_subheading}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Trust Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-8 rounded-2xl bg-dark border border-dark-lighter"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-grey-pastel mb-2">
                Ready to Experience Premium Transportation?
              </h3>
              <p className="text-grey-medium">
                Join thousands of satisfied customers who trust Luxeridex for
                their transportation needs.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 rounded-lg bg-dark-lighter border border-grey-muted">
                <div className="text-2xl font-bold text-primary">4.9★</div>
                <div className="text-xs text-grey-medium">Average Rating</div>
              </div>
              <div className="px-6 py-3 rounded-lg bg-dark-lighter border border-grey-muted">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-xs text-grey-medium">Happy Clients</div>
              </div>
              <div className="px-6 py-3 rounded-lg bg-dark-lighter border border-grey-muted">
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-xs text-grey-medium">Years Experience</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}