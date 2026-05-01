'use client';
import { motion } from 'framer-motion';
import { Card } from '../../components/shared/Card';
import { LoginForm } from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-dark pt-28 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md pt-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-grey-pastel mt-4 mb-2">
            Welcome Back
          </h1>
          <p className="text-grey-medium">
            Sign in to manage your bookings and account
          </p>
        </div>

        <Card padding="lg" className="bg-dark-charcoal border-dark-lighter">
          <LoginForm />
        </Card>
      </motion.div>
    </main>
  );
}