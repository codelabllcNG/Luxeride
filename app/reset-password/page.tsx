'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

function ResetPasswordContent() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Client-side Validation
    if (password.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          password: password 
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setStatus({ type: 'success', message: 'Password reset successfully!' });
        // Optional: Auto redirect after 2 seconds
        setTimeout(() => router.push('/login'), 2500);
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to reset password.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Success View (Replaces form on success)
  if (status?.type === 'success') {
    return (
      <div className="w-full max-w-md pt-10">
        <Card padding="lg" className="bg-dark-charcoal border-dark-lighter text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-grey-pastel mb-2">Password Reset!</h2>
            <p className="text-grey-medium mb-6">
              Your password has been updated successfully. <br/> You can now log in.
            </p>
            <Button 
              onClick={() => router.push('/login')} 
              fullWidth 
              className="bg-primary hover:bg-primary-dark text-grey-pastel"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 2. Default Form View
  return (
    <div className="w-full max-w-md pt-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-grey-pastel mb-2">New Password</h1>
        <p className="text-grey-medium">Create a strong password for your account.</p>
      </div>

      <Card padding="lg" className="bg-dark-charcoal border-dark-lighter">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* New Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-grey-pastel">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-medium" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark/50 border border-dark-lighter rounded-lg py-3 pl-10 pr-10 text-grey-pastel placeholder:text-grey-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-medium hover:text-grey-pastel transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-grey-pastel">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-medium" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-dark/50 border rounded-lg py-3 pl-10 pr-10 text-grey-pastel placeholder:text-grey-dark focus:outline-none focus:ring-1 transition-colors ${
                  confirmPassword && password !== confirmPassword 
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' 
                    : 'border-dark-lighter focus:border-primary focus:ring-primary'
                }`}
                placeholder="••••••••"
                required
              />
            </div>
            {/* Live Error Text */}
            {confirmPassword && password !== confirmPassword && (
               <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* API Error Message */}
          {status && status.type === 'error' && (
            <div className="p-3 rounded-md bg-red-500/10 text-red-500 text-sm text-center">
              {status.message}
            </div>
          )}

          <Button type="submit" fullWidth disabled={isLoading} className="bg-primary hover:bg-primary-dark text-grey-pastel">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Reset Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

// Main Page Wrapper (Required for useSearchParams)
export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-dark pt-28 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Suspense fallback={<div className="text-grey-pastel">Loading...</div>}>
          <ResetPasswordContent />
        </Suspense>
      </motion.div>
    </main>
  );
}