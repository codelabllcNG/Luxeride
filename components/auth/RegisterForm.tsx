"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { registerUser } from '@/lib/api/auth';
import {toast} from 'sonner';
import { Loader2 } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (!formData.agreeToTerms) {
        toast.error("You must agree to the terms.");
        return;
    }

    setIsLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    const result = await registerUser(payload);

    if (result.status === 'success') {
      toast.success('Registration successful! Please log in.');
      router.push('/login'); 
    } else {
      toast.error(result.message || 'Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <Input
        label="Full Name"
        placeholder="John Doe"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        disabled={isLoading} 
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        disabled={isLoading}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="(202) 555-0123"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
        disabled={isLoading}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={isLoading}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex items-start">
        <input
          id="agree-terms"
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
          className="h-4 w-4 mt-1 rounded border-grey-muted bg-dark-lighter text-primary focus:ring-primary"
          required
          disabled={isLoading}
        />
        <label htmlFor="agree-terms" className="ml-2 block text-sm text-grey-medium">
          I agree to the{' '}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>

      {/* Button handles loading state */}
      <Button 
        type="submit" 
        variant="primary" 
        fullWidth 
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dark-lighter"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-dark-card text-grey-medium">
            Or register with
          </span>
        </div>
      </div>

      <p className="text-center text-sm text-grey-medium mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Log in
        </Link>
      </p>
    </form>
  );
}
