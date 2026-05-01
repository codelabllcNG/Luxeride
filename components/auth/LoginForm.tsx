'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { loginUser, LoginPayload } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/useAuthStore';
import {toast} from 'sonner';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
   

    try {
      const payload: LoginPayload = {
        email: formData.email,
        password: formData.password
      };


      const response = await loginUser(payload);

      if (response.status === 'success') {
        setUser(response.user);
        toast.success('Login successful!');
        router.push('/dashboard');

      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={(e:any) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-grey-pastel">Password</label>
          <Link href="/forget-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e:any) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center">
        <input
          id="remember-me"
          type="checkbox"
          checked={formData.rememberMe}
          onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
          className="h-4 w-4 rounded border-grey-muted bg-dark-lighter text-primary focus:ring-primary"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-grey-medium">
          Remember me
        </label>
      </div>



      <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : 'Log In'}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dark-lighter"></div>
        </div>
      </div>

      <p className="text-center text-sm text-grey-medium mt-6">
        Don't have an account?{' '}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
}