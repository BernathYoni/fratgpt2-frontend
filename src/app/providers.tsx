'use client';

import { OnboardingProvider } from '@/contexts/OnboardingContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      {children}
    </OnboardingProvider>
  );
}
