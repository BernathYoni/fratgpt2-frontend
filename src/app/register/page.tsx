'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Navigation } from '../components/Navigation';
import { api } from '@/lib/api';
import { saveToken } from '@/lib/auth';
import { CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Get affiliate code if exists
      const affiliateCode = localStorage.getItem('fratgpt_affiliate_ref') || undefined;
      if (affiliateCode) console.log('[REGISTER] Applying affiliate code:', affiliateCode);

      // Pass affiliateCode as 5th argument (firstName/lastName undefined)
      const registerRes = await api.register(email, password, undefined, undefined, affiliateCode);

      if (!registerRes.success || !registerRes.data?.token) {
        const errorMsg = registerRes.error || 'Registration failed';
        if (errorMsg.toLowerCase().includes('exists') || errorMsg.toLowerCase().includes('already')) {
          setError('An account with this email already exists. Please login instead.');
        } else {
          setError(errorMsg);
        }
        setLoading(false);
        return;
      }

      saveToken(registerRes.data.token);
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Unable to connect to server. Please check your internet connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="flex items-center justify-center p-6 md:p-8 pt-20 sm:pt-24 lg:pt-28 min-h-screen">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl w-full">
          {/* Left Side - Form */}
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Create your account</h1>
              <p className="text-text-secondary text-base">Join thousands of students improving their grades</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />

              <Input
                type="password"
                label="Password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && (
                <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full text-base py-3" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-text-secondary text-sm">
              Already have an account?{' '}
              <Link href="/login" className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent hover:underline font-semibold">
                Log in
              </Link>
            </p>
          </div>

          {/* Right Side - Features */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-pink-500/10 via-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-3xl p-8 h-full">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Why FratGPT?
              </h3>
              <div className="space-y-6">
                <FeatureItem
                  title="Instant Solutions"
                  description="Get homework answers in seconds with our AI-powered solver"
                />
                <FeatureItem
                  title="Step-by-Step Help"
                  description="Understand how to solve problems with detailed explanations"
                />
                <FeatureItem
                  title="Works Anywhere"
                  description="Chrome extension works on any website or homework platform"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center mt-1">
        <CheckCircle className="w-4 h-4 text-white" />
      </div>
      <div>
        <h4 className="font-semibold text-lg mb-1">{title}</h4>
        <p className="text-text-secondary text-sm">{description}</p>
      </div>
    </div>
  );
}
