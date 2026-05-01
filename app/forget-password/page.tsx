'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button'; // Assuming you have this
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';



export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE_URL}/forget-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();

      if (res.ok && data.status === 'success') {
        // Success: Redirect to Confirm Pin page with email in URL
        router.push(`/confirm-pin?email=${encodeURIComponent(email)}`);
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark pt-28 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md pt-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-grey-pastel mb-2">Forgot Password?</h1>
          <p className="text-grey-medium">Enter your email to receive a reset code.</p>
        </div>

        <Card padding="lg" className="bg-dark-charcoal border-dark-lighter">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-grey-pastel">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-medium" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-dark/50 border border-dark-lighter rounded-lg py-3 pl-10 pr-4 text-grey-pastel placeholder:text-grey-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Error/Success Message */}
            {status && (
              <div className={`p-3 rounded-md text-sm ${status.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                {status.message}
              </div>
            )}

            <Button type="submit" fullWidth disabled={isLoading} className="bg-primary hover:bg-primary-dark text-grey-pastel">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Send Reset Code'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-grey-medium hover:text-grey-pastel transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </Card>
      </motion.div>
    </main>
  );
}