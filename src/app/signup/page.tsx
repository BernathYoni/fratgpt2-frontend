'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Navigation } from '../components/Navigation';
import { api } from '@/lib/api';
import { saveToken } from '@/lib/auth';
import { isMobileDevice } from '@/lib/deviceDetection';

declare global {
  interface Window {
    google: any;
  }
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get plan from URL parameter or localStorage (fallback)
  const urlPlan = searchParams.get('plan');
  const storedPlan = typeof window !== 'undefined' ? localStorage.getItem('selected_plan') : null;
  const plan = urlPlan || storedPlan;
  const fromExtension = searchParams.get('source') === 'extension';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Clear stored plan on mount if it doesn't match URL parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlan = localStorage.getItem('selected_plan');
      // If there's a stored plan but no URL plan, or they don't match, clear it
      if (storedPlan && (!urlPlan || storedPlan !== urlPlan)) {
        localStorage.removeItem('selected_plan');
      }
    }
  }, [urlPlan]);

  // Clear stored plan when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selected_plan');
      }
    };
  }, []);

  // Load Google Identity Services
  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.google && googleButtonRef.current) {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
          });

          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              theme: 'outline',
              size: 'large',
              width: googleButtonRef.current.offsetWidth,
              text: 'signup_with',
            }
          );
        }
      };
    };

    loadGoogleScript();
  }, []);

  const handleGoogleCallback = async (response: any) => {
    setLoading(true);
    setError('');

    try {
      const result = await api.googleAuth(response.credential);

      if (!result.success || !result.data?.token) {
        setError(result.error || 'Failed to authenticate with Google');
        setLoading(false);
        return;
      }

      const token = result.data.token;
      saveToken(token);

      // Clear stored plan from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selected_plan');
      }

      // If opened from extension, redirect to callback page with token (always use custom domain)
      if (fromExtension) {
        window.location.href = `https://fratgpt.co/extension-auth?token=${token}`;
        return;
      }

      // Unified signup flow:
      // 1. No plan selected → Go to subscribe page to pick a plan
      // 2. Free plan selected → Go directly to onboarding
      // 3. Paid plan selected → Go to Stripe checkout → Then onboarding

      if (!plan) {
        // No plan selected - redirect to subscribe page to choose one
        router.push('/subscribe');
        return;
      }

      if (plan === 'free') {
        // Free plan - go directly to onboarding
        const isMobile = isMobileDevice();
        if (isMobile) {
          router.push('/onboarding/mobile');
        } else {
          router.push('/onboarding/install-extension');
        }
        return;
      }

      // Paid plan selected - redirect to Stripe checkout
      try {
        const checkoutRes = await api.createCheckoutSession(token, plan as 'basic' | 'pro' | 'unlimited');

        if (!checkoutRes.success || !checkoutRes.data?.url) {
          setError('Failed to create checkout session. Please try again.');
          setLoading(false);
          return;
        }

        // Redirect to Stripe
        window.location.href = checkoutRes.data.url;
      } catch (checkoutErr) {
        console.error('Checkout error:', checkoutErr);
        setError('Failed to redirect to payment. Please try again from the subscribe page.');
        setLoading(false);
        setTimeout(() => router.push('/subscribe'), 2000);
      }
    } catch (err) {
      console.error('Google auth error:', err);
      setError('Failed to authenticate with Google. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    console.log('[SIGNUP] 📝 Starting signup process...');
    console.log('[SIGNUP] Plan selected:', plan || 'NONE');

    try {
      console.log('[SIGNUP] 🌐 Calling /auth/register API...');
      const registerRes = await api.register(email, password, firstName, lastName);
      console.log('[SIGNUP] API response:', registerRes.success ? 'SUCCESS' : 'FAILED');

      if (!registerRes.success) {
        console.error('[SIGNUP] ❌ Registration failed:', registerRes.error);
        // Handle specific error messages
        const errorMsg = registerRes.error || 'Failed to create account';
        if (errorMsg.toLowerCase().includes('already exists') || errorMsg.toLowerCase().includes('duplicate') || errorMsg.toLowerCase().includes('already registered')) {
          setError('This email is already registered. Try logging in instead.');
        } else if (errorMsg.toLowerCase().includes('invalid email')) {
          setError('Please enter a valid email address');
        } else {
          setError(errorMsg);
        }
        setLoading(false);
        return;
      }

      // Register returns token directly - no need to login again!
      const token = registerRes.data?.token;
      console.log('[SIGNUP] Token from register:', token ? `Received: ${token.substring(0, 20)}...` : 'MISSING!');

      if (!token) {
        console.error('[SIGNUP] ❌ No token received from registration');
        setError('Account created but login failed. Please log in manually.');
        setLoading(false);
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      // Save token - user is now logged in!
      console.log('[SIGNUP] ✅ Account created successfully, saving token...');
      saveToken(token);
      console.log('[SIGNUP] ✓ User is now logged in');

      // Clear stored plan from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selected_plan');
      }

      // If opened from extension, redirect to callback page with token (always use custom domain)
      if (fromExtension) {
        window.location.href = `https://fratgpt.co/extension-auth?token=${token}`;
        return;
      }

      // Unified signup flow:
      // 1. No plan selected → Go to subscribe page to pick a plan
      // 2. Free plan selected → Go directly to dashboard
      // 3. Paid plan selected → Go to Stripe checkout → Success page → Dashboard

      if (!plan) {
        // No plan selected - redirect to subscribe page to choose one
        console.log('[SIGNUP] 🔀 No plan selected, redirecting to /subscribe...');
        // Set flag so subscribe page knows this is a new user selecting their first plan
        localStorage.setItem('just_signed_up', 'true');
        router.push('/subscribe');
        return;
      }

      if (plan === 'free') {
        // Free plan - go directly to dashboard
        console.log('[SIGNUP] 🆓 Free plan selected, redirecting to dashboard...');
        router.push('/dashboard');
        return;
      }

      // Paid plan selected - redirect to Stripe checkout
      console.log('[SIGNUP] 💳 Paid plan selected:', plan, '- Creating checkout session...');
      try {
        const checkoutRes = await api.createCheckoutSession(token, plan as 'basic' | 'pro' | 'unlimited');
        console.log('[SIGNUP] Checkout response:', checkoutRes.success ? 'SUCCESS' : 'FAILED');

        if (!checkoutRes.success || !checkoutRes.data?.url) {
          console.error('[SIGNUP] ❌ Checkout creation failed:', checkoutRes.error);
          setError('Failed to create checkout session. Please try again.');
          setLoading(false);
          return;
        }

        console.log('[SIGNUP] ✓ Checkout URL received, redirecting to Stripe...');
        console.log('[SIGNUP] Stripe URL:', checkoutRes.data.url);
        // Redirect to Stripe - they'll return to /subscription/success then dashboard
        window.location.href = checkoutRes.data.url;
      } catch (checkoutErr) {
        console.error('Checkout error:', checkoutErr);
        setError('Failed to redirect to payment. Please try again from the subscribe page.');
        setLoading(false);
        setTimeout(() => router.push('/subscribe'), 2000);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Unable to connect to server. Please check your internet connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen pt-20">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Create your account</h1>
            <p className="text-text-secondary text-base">Start solving homework problems instantly</p>
            {plan && plan !== 'free' && (
              <div className="mt-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-lg px-4 py-3">
                <p className="text-sm">
                  <span className="font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    {plan === 'basic' ? 'Basic Plan' : plan === 'pro' ? 'Pro Plan' : 'Unlimited Plan'} selected
                  </span>
                  {' '}- You'll complete payment and then start onboarding
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                label="First Name"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <Input
                type="text"
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-text-secondary">Or continue with</span>
            </div>
          </div>

          <div ref={googleButtonRef} className="w-full"></div>

          <p className="mt-6 text-center text-text-secondary text-sm">
            Already have an account?{' '}
            <Link href="/login" className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent hover:underline font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Feature Highlights */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12">
        <div className="max-w-xl w-full">
          <h2 className="text-4xl font-bold mb-10">Join thousands of students</h2>
          <div className="space-y-6">
            <FeatureItem
              title="Instant Solutions"
              description="Get answers to any homework problem in seconds"
            />
            <FeatureItem
              title="Step-by-Step Help"
              description="Understand not just the answer, but how to get there"
            />
            <FeatureItem
              title="Works Anywhere"
              description="Use on any webpage, PDF, or online assignment"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start">
      <div className="bg-gradient-to-br from-pink-500 to-orange-500 w-14 h-14 rounded-lg flex items-center justify-center mr-5 flex-shrink-0">
        <span className="text-white text-2xl">✓</span>
      </div>
      <div>
        <h3 className="font-semibold mb-2 text-xl">{title}</h3>
        <p className="text-text-secondary text-base leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <Suspense fallback={<div className="flex items-center justify-center p-8 pt-20 sm:pt-24 lg:pt-28 min-h-screen"><div className="text-text-secondary">Loading...</div></div>}>
        <SignupContent />
      </Suspense>
    </div>
  );
}
