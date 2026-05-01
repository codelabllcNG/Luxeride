'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import {
  TruckIcon,
  PackageIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  InfoIcon,
  CheckCircle2Icon
} from 'lucide-react';

const BASE_RATE = 50;
const WEIGHT_RATE = 2; // $2 per kg
const INSURANCE_PERCENTAGE = 0.05; // 5%

export default function LoadingPage() {
  const [weight, setWeight] = useState<string>('');
  const [hasInsurance, setHasInsurance] = useState<boolean>(false);

  const calculation = useMemo(() => {
    const w = parseFloat(weight) || 0;
    const baseTotal = BASE_RATE + (w * WEIGHT_RATE);
    const insuranceAmount = hasInsurance ? baseTotal * INSURANCE_PERCENTAGE : 0;
    const finalTotal = baseTotal + insuranceAmount;

    return {
      baseTotal,
      insuranceAmount,
      finalTotal,
      isValid: w > 0
    };
  }, [weight, hasInsurance]);

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
              <PackageIcon className="w-4 h-4 text-primary" />
              <span className="text-sm text-grey-pastel tracking-wide uppercase">
                Loading & Haulage
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-grey-pastel mb-6">
              Smart <span className="text-primary">Loading</span> Calculator
            </h1>
            <p className="text-xl text-grey-medium mb-8">
              Get an instant estimate for your goods. Enter the weight and choose your insurance preference for a transparent, reliable quote.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Input Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="space-y-8 p-8 bg-dark-charcoal border-dark-lighter">
                <div>
                  <h3 className="text-xl font-bold text-grey-pastel mb-4 flex items-center">
                    <TruckIcon className="w-5 h-5 text-primary mr-2" />
                    Shipment Details
                  </h3>
                  <Input
                    label="Weight of Goods (kg)"
                    type="number"
                    placeholder="e.g. 50"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="mb-4"
                  />
                  <p className="text-xs text-grey-muted">
                    * Estimated weight in kilograms. Base handling fee of ${BASE_RATE} applies.
                  </p>
                </div>

                <div className="pt-6 border-t border-dark-lighter">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <ShieldCheckIcon className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-semibold text-grey-pastel">Insurance Coverage</h4>
                        <p className="text-xs text-grey-medium italic">Protect your goods against all risks</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={hasInsurance}
                        onChange={(e) => setHasInsurance(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-dark-lighter peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-grey-muted after:border-grey-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:bg-white peer-checked:after:border-white"></div>
                    </label>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Results Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-8 bg-dark-charcoal border-primary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <PackageIcon className="w-24 h-24 text-primary" />
                </div>

                <h3 className="text-xl font-bold text-grey-pastel mb-6">Estimate Summary</h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-grey-medium">
                    <span>Base Handling</span>
                    <span>${BASE_RATE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-grey-medium">
                    <span>Weight Fee ({weight || 0} kg)</span>
                    <span>${(parseFloat(weight || '0') * WEIGHT_RATE).toFixed(2)}</span>
                  </div>
                  {hasInsurance && (
                    <div className="flex justify-between items-center text-primary-light">
                      <span className="flex items-center">
                        Insurance (5%)
                        <InfoIcon className="w-3 h-3 ml-1" />
                      </span>
                      <span>+${calculation.insuranceAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-dark-lighter flex justify-between items-end">
                    <div>
                      <p className="text-sm text-grey-medium mb-1">Total Estimated Cost</p>
                      <p className="text-4xl font-bold text-grey-pastel">
                        ${calculation.finalTotal.toFixed(2)}
                      </p>
                    </div>
                    {!calculation.isValid && (
                      <span className="text-[10px] text-grey-muted mb-2 uppercase tracking-widest">Awaiting input</span>
                    )}
                  </div>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  disabled={!calculation.isValid}
                  className="shadow-gold hover:shadow-gold-lg transition-shadow"
                >
                  Confirm Booking
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>

                <div className="mt-6 flex items-center space-x-2 text-xs text-grey-medium">
                  <CheckCircle2Icon className="w-4 h-4 text-primary" />
                  <span>Price includes loading and unloading assistance</span>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-24 bg-dark-charcoal/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-grey-pastel mb-8">Why Choose Our Loading Services?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-grey-pastel mb-2">Professional Fleet</h4>
              <p className="text-sm text-grey-medium">Well-maintained vehicles optimized for various types of cargo.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-grey-pastel mb-2">Secure Handling</h4>
              <p className="text-sm text-grey-medium">Expert loaders trained to handle fragile and high-value items.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <PackageIcon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-grey-pastel mb-2">Flexible Options</h4>
              <p className="text-sm text-grey-medium">Tailored solutions for residential, commercial, and industrial needs.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
