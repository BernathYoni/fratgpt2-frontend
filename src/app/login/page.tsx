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

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromExtension = searchParams.get('source') === 'extension';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

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
              text: 'signin_with',
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

      saveToken(result.data.token);

      // If opened from extension, redirect to callback page with token (always use custom domain)
      if (fromExtension) {
        window.location.href = `https://fratgpt.co/extension-auth?token=${result.data.token}`;
        return;
      }

      // Redirect to dashboard after Google login
      router.push('/dashboard');
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
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const loginRes = await api.login(email, password);

      if (!loginRes.success || !loginRes.data?.token) {
        // Handle specific error messages
        const errorMsg = loginRes.error || 'Invalid email or password';
        if (errorMsg.toLowerCase().includes('not found') || errorMsg.toLowerCase().includes('no user')) {
          setError('No account found with this email. Please sign up first.');
        } else if (errorMsg.toLowerCase().includes('password')) {
          setError('Incorrect password. Please try again.');
        } else if (errorMsg.toLowerCase().includes('invalid')) {
          setError('Invalid email or password. Please check and try again.');
        } else {
          setError(errorMsg);
        }
        setLoading(false);
        return;
      }

      saveToken(loginRes.data.token);

      // If opened from extension, redirect to callback page with token (always use custom domain)
      if (fromExtension) {
        window.location.href = `https://fratgpt.co/extension-auth?token=${loginRes.data.token}`;
        return;
      }

      // Redirect to dashboard after login
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please check your internet connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-6 md:p-8 pt-20 sm:pt-24 lg:pt-28 min-h-screen">
      <div className="w-full max-w-lg">
        <div className="mb-8 mt-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome back</h1>
          <p className="text-text-secondary text-base">Log in to continue solving problems</p>
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full text-base py-3" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
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
          Don't have an account?{' '}
          <Link href="/signup" className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <Suspense fallback={<div className="flex items-center justify-center p-8 pt-20 sm:pt-24 lg:pt-28 min-h-screen"><div className="text-text-secondary">Loading...</div></div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
