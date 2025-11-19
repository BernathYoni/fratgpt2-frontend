'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/app/components/Navigation';
import { Button } from '@/app/components/ui/Button';
import { Scissors, Monitor, Zap, ArrowRight } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { isAuthenticated } from '@/lib/auth';

export default function TutorialPage() {
  const router = useRouter();
  const { onboardingCompleted, currentStep, isMobile, updateStep } = useOnboarding();
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // If onboarding is completed, redirect to dashboard
    if (onboardingCompleted) {
      router.push('/dashboard');
      return;
    }

    // If mobile, redirect to mobile onboarding
    if (isMobile) {
      router.push('/onboarding/mobile');
      return;
    }

    // If not yet installed extension, go back
    if (currentStep === 'account_created' || currentStep === 'plan_selected') {
      router.push('/onboarding/install-extension');
      return;
    }

    // If already completed tutorial or first snip, go to demo
    if (currentStep === 'tutorial_completed' || currentStep === 'first_snip_completed') {
      router.push('/onboarding/demo');
      return;
    }
  }, [onboardingCompleted, isMobile, currentStep, router]);

  const handleContinue = async () => {
    setIsCompleting(true);
    const success = await updateStep('tutorial_completed');

    if (success) {
      router.push('/onboarding/demo');
    } else {
      alert('Failed to update progress. Please try again.');
    }

    setIsCompleting(false);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 pt-20 pb-12">
        <div className="max-w-4xl w-full">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-2">
              <span>Step 2 of 3</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-2 bg-accent rounded-full"></div>
              <div className="flex-1 h-2 bg-accent rounded-full"></div>
              <div className="flex-1 h-2 bg-surface-hover rounded-full"></div>
            </div>
          </div>

          {/* Main content */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              How to Use FratGPT
            </h1>
            <p className="text-xl text-text-secondary">
              Learn the two ways to solve homework problems
            </p>
          </div>

          {/* Tutorial cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Snip Mode */}
            <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4">
                  <Scissors className="w-8 h-8 text-pink-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Snip Mode</h2>
                <p className="text-text-secondary">
                  Select and solve a specific problem
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm text-text-secondary">
                    Click the FratGPT extension icon in your browser toolbar
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm text-text-secondary">
                    Click "Snip Mode" button
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm text-text-secondary">
                    Drag to select the problem you want to solve
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                    4
                  </div>
                  <p className="text-sm text-text-secondary">
                    Get instant step-by-step solutions!
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                <p className="text-sm font-semibold text-accent">
                  Best for: Single problems, specific questions
                </p>
              </div>
            </div>

            {/* Screen Mode */}
            <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mb-4">
                  <Monitor className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Screen Mode</h2>
                <p className="text-text-secondary">
                  Solve multiple problems at once
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm text-text-secondary">
                    Click the FratGPT extension icon
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm text-text-secondary">
                    Click "Screen Mode" button
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm text-text-secondary">
                    The extension captures your entire visible screen
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white text-sm font-bold">
                    4
                  </div>
                  <p className="text-sm text-text-secondary">
                    Get solutions for all visible problems at once!
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg">
                <p className="text-sm font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  Best for: Full worksheets, multiple problems
                </p>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-r from-pink-500/10 to-orange-500/10 border border-pink-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Quick Tips</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Make sure the problem is clearly visible before capturing</li>
                  <li>• Use Snip Mode for better accuracy on single problems</li>
                  <li>• Use Screen Mode when you have multiple problems on one page</li>
                  <li>• You can expand explanations to see step-by-step solutions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Continue button */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleContinue}
              disabled={isCompleting}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              {isCompleting ? 'Saving...' : (
                <>
                  Try It Yourself
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
