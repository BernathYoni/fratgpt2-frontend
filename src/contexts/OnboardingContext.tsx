'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { getToken, isAuthenticated } from '@/lib/auth';
import { isMobileDevice } from '@/lib/deviceDetection';

export type OnboardingStep =
  | 'account_created'
  | 'plan_selected'
  | 'extension_installed'
  | 'tutorial_completed'
  | 'first_snip_completed'
  | 'completed';

interface OnboardingContextType {
  // State
  isLoading: boolean;
  onboardingCompleted: boolean;
  currentStep: OnboardingStep;
  isMobile: boolean;
  error: string | null;

  // Actions
  refreshOnboardingStatus: () => Promise<void>;
  updateStep: (step: OnboardingStep) => Promise<boolean>;
  completeOnboarding: () => Promise<boolean>;
  resetOnboarding: () => Promise<boolean>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('account_created');
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshOnboardingStatus = async () => {
    if (!isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await api.getOnboardingStatus(token);

      if (response.success && response.data) {
        setOnboardingCompleted(response.data.onboardingCompleted);
        setCurrentStep(response.data.onboardingStep as OnboardingStep);
        setIsMobile(response.data.isMobileDevice);
      } else {
        setError(response.error || 'Failed to fetch onboarding status');
      }
    } catch (err) {
      console.error('Error fetching onboarding status:', err);
      setError('Failed to fetch onboarding status');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStep = async (step: OnboardingStep): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    try {
      setError(null);
      const response = await api.updateOnboardingStep(token, step);

      if (response.success && response.data) {
        setCurrentStep(response.data.onboardingStep as OnboardingStep);
        setOnboardingCompleted(response.data.onboardingCompleted);
        return true;
      } else {
        setError(response.error || 'Failed to update onboarding step');
        return false;
      }
    } catch (err) {
      console.error('Error updating onboarding step:', err);
      setError('Failed to update onboarding step');
      return false;
    }
  };

  const completeOnboarding = async (): Promise<boolean> => {
    return updateStep('completed');
  };

  const resetOnboarding = async (): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    try {
      setError(null);
      const response = await api.resetOnboarding(token);

      if (response.success && response.data) {
        setCurrentStep(response.data.onboardingStep as OnboardingStep);
        setOnboardingCompleted(response.data.onboardingCompleted);
        return true;
      } else {
        setError(response.error || 'Failed to reset onboarding');
        return false;
      }
    } catch (err) {
      console.error('Error resetting onboarding:', err);
      setError('Failed to reset onboarding');
      return false;
    }
  };

  // Initialize onboarding status on mount
  useEffect(() => {
    refreshOnboardingStatus();
  }, []);

  // Detect device type and update backend if needed
  useEffect(() => {
    const detectAndUpdateDevice = async () => {
      if (!isAuthenticated()) return;

      const token = getToken();
      if (!token) return;

      const deviceIsMobile = isMobileDevice();

      // If device type differs from what's stored, update it
      if (deviceIsMobile !== isMobile && !isLoading) {
        try {
          await api.setDeviceType(token, deviceIsMobile);
          setIsMobile(deviceIsMobile);
        } catch (err) {
          console.error('Error updating device type:', err);
        }
      }
    };

    detectAndUpdateDevice();
  }, [isMobile, isLoading]);

  const value: OnboardingContextType = {
    isLoading,
    onboardingCompleted,
    currentStep,
    isMobile,
    error,
    refreshOnboardingStatus,
    updateStep,
    completeOnboarding,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
