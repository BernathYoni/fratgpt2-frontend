'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/app/components/Navigation';
import { Button } from '@/app/components/ui/Button';
import { XCircle } from 'lucide-react';

export default function SubscriptionCancelPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/subscribe');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-full blur-xl opacity-50"></div>
              <div className="relative bg-surface border border-border rounded-full p-8">
                <XCircle className="w-16 h-16 text-orange-500" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">Subscription Cancelled</h1>
          <p className="text-text-secondary mb-8">
            No payment was made. You can try again anytime.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/subscribe')}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              View Plans
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
