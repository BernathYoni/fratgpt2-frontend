'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/app/components/Navigation';
import { Button } from '@/app/components/ui/Button';
import { Smartphone, Monitor, ArrowRight } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { isAuthenticated } from '@/lib/auth';

export default function MobileOnboardingPage() {
  const router = useRouter();
  const { onboardingCompleted, currentStep, isMobile } = useOnboarding();

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // If onboarding is already completed, redirect to dashboard
    if (onboardingCompleted) {
      router.push('/dashboard');
      return;
    }

    // If user is on desktop, redirect to desktop onboarding
    if (!isMobile) {
      router.push('/onboarding/install-extension');
      return;
    }
  }, [onboardingCompleted, isMobile, router]);

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 pt-20">
        <div className="max-w-2xl w-full text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-xl opacity-50"></div>
              <div className="relative bg-surface border border-border rounded-full p-8">
                <Smartphone className="w-16 h-16 text-pink-500" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            FratGPT Extension
          </h1>
          <h2 className="text-xl sm:text-2xl text-text-secondary mb-8">
            Install on Desktop to Continue
          </h2>

          {/* Instructions */}
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 mb-8 text-left">
            <p className="text-text-secondary mb-6">
              FratGPT is a Chrome extension that helps you solve homework problems right on your assignments page. To get started:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Open on Desktop</p>
                  <p className="text-text-secondary text-sm">
                    Visit FratGPT on a desktop computer with Chrome, Edge, or Brave browser
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Install Extension</p>
                  <p className="text-text-secondary text-sm">
                    Download and install the FratGPT extension from the Chrome Web Store
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Start Solving</p>
                  <p className="text-text-secondary text-sm">
                    Use the extension on any homework assignment to get instant help
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
              <Monitor className="w-4 h-4" />
              <span>Extension only works on desktop browsers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
