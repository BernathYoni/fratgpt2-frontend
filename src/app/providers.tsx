'use client';

import { Suspense } from 'react';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { ReferralTracker } from './components/ReferralTracker';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      <Suspense fallback={null}>
        <ReferralTracker />
      </Suspense>
      {children}
    </OnboardingProvider>
  );
}
