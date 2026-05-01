'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/shared/Card';
import { RegisterForm } from '../../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="min-h-screen  bg-dark pt-44 py-6 flex items-center justify-center px-4 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-grey-pastel mb-2">
            Create Account
          </h1>
          <p className="text-grey-medium">
            Join Luxeridex for premium benefits
          </p>
        </div>

        <Card padding="lg" className="bg-dark-charcoal  border-dark-lighter ">
          <RegisterForm />
        </Card>
      </motion.div>
    </main>
  );
}