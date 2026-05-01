'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Helper component to handle search params safely
function ConfirmPinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  // State for the 6 boxes
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  // Refs to manage focus jumping
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 1. Handle Typing in a Box
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 2. Handle Backspace (Move focus back)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 3. Handle Paste (Optional UX polish)
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newPin = [...pin];
    pastedData.forEach((char, index) => {
      if (index < 6 && /^\d$/.test(char)) newPin[index] = char;
    });
    setPin(newPin);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = pin.join('');
    
    if (fullPin.length !== 6) {
      setStatus({ type: 'error', message: 'Please enter all 6 digits.' });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE_URL}/confirm-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pin: fullPin }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        // Success: Go to Reset Password Page
        router.push(`/reset-password?email=${encodeURIComponent(email || '')}&code=${fullPin}`);
      } else {
        setStatus({ type: 'error', message: data.message || 'Invalid PIN.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md pt-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-grey-pastel mb-2">Verify Code</h1>
          <p className="text-grey-medium">
            We sent a 6-digit code to <br/> <span className="text-grey-pastel font-medium">{email}</span>
          </p>
        </div>

        <Card padding="lg" className="bg-dark-charcoal border-dark-lighter">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 6 BOX PIN INPUT */}
            <div className="flex justify-between gap-2">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold bg-dark/50 border border-dark-lighter rounded-lg text-grey-pastel focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
                />
              ))}
            </div>

            {/* Error Message */}
            {status && (
              <div className="text-center p-2 rounded bg-red-500/10 text-red-500 text-sm">
                {status.message}
              </div>
            )}

            <Button type="submit" fullWidth disabled={isLoading || pin.join('').length !== 6} className="bg-primary hover:bg-primary-dark text-grey-pastel">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Verify & Continue'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-grey-medium">Didn't receive code? </span>
            <button className="text-primary hover:underline font-medium" onClick={() => alert("Logic to resend code")}>
              Resend
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-xs text-grey-dark hover:text-grey-medium flex items-center justify-center">
              <ArrowLeft className="w-3 h-3 mr-1" />
              Change Email
            </Link>
          </div>
        </Card>
    </div>
  );
}

// Main Page Component
export default function ConfirmPinPage() {
  return (
    <main className="min-h-screen bg-dark pt-28 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Suspense fallback={<div className="text-grey-pastel">Loading...</div>}>
            <ConfirmPinContent />
        </Suspense>
      </motion.div>
    </main>
  );
}