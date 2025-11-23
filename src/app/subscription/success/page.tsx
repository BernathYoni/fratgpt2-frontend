'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '@/app/components/Navigation';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { CheckCircle2 } from 'lucide-react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    async function handleSuccess() {
      console.log('[SUCCESS] 🎉 Payment success page loaded');
      console.log('[SUCCESS] Session ID:', sessionId || 'NONE');

      const token = getToken();
      console.log('[SUCCESS] Checking auth token...');

      if (!token) {
        console.error('[SUCCESS] ❌ No token found! Redirecting to login...');
        router.push('/login');
        return;
      }

      console.log('[SUCCESS] ✓ Token found, user is authenticated');
      console.log('[SUCCESS] ⏳ Waiting 2s for Stripe webhook to process...');

      // Wait for webhook to process (give Stripe time to update subscription)
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('[SUCCESS] ✓ Wait complete, redirecting to dashboard...');
      // Redirect to dashboard - payment successful!
      router.push('/dashboard');
    }

    handleSuccess();
  }, [router, sessionId]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="flex items-center justify-center min-h-screen px-4 pt-20">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-xl opacity-30"></div>
              <div className="relative bg-surface border border-border rounded-full p-8">
                <CheckCircle2 className="w-16 h-16 text-pink-500" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            Payment Successful!
          </h1>
          <p className="text-text-secondary mb-6">
            Your FratGPT subscription is now active. Redirecting you...
          </p>

          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
