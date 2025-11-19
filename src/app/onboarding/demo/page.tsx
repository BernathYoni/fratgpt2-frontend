'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/app/components/Navigation';
import { Button } from '@/app/components/ui/Button';
import { Rocket, CheckCircle2, ExternalLink } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { isAuthenticated } from '@/lib/auth';

export default function DemoPage() {
  const router = useRouter();
  const { onboardingCompleted, currentStep, isMobile, completeOnboarding } = useOnboarding();
  const [isCompleting, setIsCompleting] = useState(false);
  const [firstSnipDetected, setFirstSnipDetected] = useState(false);

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

    // If not yet completed tutorial, go back
    if (currentStep === 'account_created' || currentStep === 'plan_selected' || currentStep === 'extension_installed') {
      router.push('/onboarding/install-extension');
      return;
    }
  }, [onboardingCompleted, isMobile, currentStep, router]);

  // Listen for first snip completion from extension
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'FRATGPT_FIRST_SNIP_COMPLETED') {
        setFirstSnipDetected(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleFinish = async () => {
    setIsCompleting(true);
    const success = await completeOnboarding();

    if (success) {
      router.push('/dashboard?onboarding_complete=true');
    } else {
      alert('Failed to complete onboarding. Please try again.');
    }

    setIsCompleting(false);
  };

  const handleSkip = async () => {
    setIsCompleting(true);
    const success = await completeOnboarding();

    if (success) {
      router.push('/dashboard');
    } else {
      alert('Failed to complete onboarding. Please try again.');
    }

    setIsCompleting(false);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 pt-20">
        <div className="max-w-3xl w-full">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-2">
              <span>Step 3 of 3</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-2 bg-accent rounded-full"></div>
              <div className="flex-1 h-2 bg-accent rounded-full"></div>
              <div className="flex-1 h-2 bg-accent rounded-full"></div>
            </div>
          </div>

          {/* Main content */}
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-xl opacity-50"></div>
                <div className="relative bg-surface border border-border rounded-full p-8">
                  {firstSnipDetected ? (
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  ) : (
                    <Rocket className="w-16 h-16 text-pink-500" />
                  )}
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {firstSnipDetected ? 'Great Job!' : 'Try Your First Solve'}
            </h1>

            {firstSnipDetected ? (
              <p className="text-xl text-text-secondary">
                You've completed your first solve. You're all set to use FratGPT!
              </p>
            ) : (
              <p className="text-xl text-text-secondary">
                Open any homework assignment and try solving a problem
              </p>
            )}
          </div>

          {/* Instructions */}
          {!firstSnipDetected && (
            <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-semibold mb-6">Let's Try It</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-2">Open a homework assignment</p>
                    <p className="text-text-secondary text-sm mb-3">
                      Navigate to any online homework, quiz, or problem set
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('https://example.com/sample-homework', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Sample Problems
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Click the FratGPT extension</p>
                    <p className="text-text-secondary text-sm">
                      Look for the FratGPT icon in your browser toolbar (top-right corner)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Choose Snip or Screen Mode</p>
                    <p className="text-text-secondary text-sm">
                      Select a problem with Snip Mode or capture the whole screen with Screen Mode
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Get your solution!</p>
                    <p className="text-text-secondary text-sm">
                      View the answer and expand to see step-by-step explanations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success message */}
          {firstSnipDetected && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 sm:p-8 mb-8">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-500 mb-2 text-lg">
                    First Solve Complete!
                  </h3>
                  <p className="text-text-secondary">
                    You've successfully used FratGPT to solve your first problem. Now you can use it on any homework assignment, quiz, or study material. Happy solving!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-center gap-4">
            {!firstSnipDetected && (
              <Button
                variant="outline"
                onClick={handleSkip}
                disabled={isCompleting}
              >
                Skip for Now
              </Button>
            )}
            <Button
              onClick={handleFinish}
              disabled={isCompleting}
              className="bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 hover:from-pink-600 hover:via-orange-600 hover:to-yellow-600"
            >
              {isCompleting ? 'Finishing...' : firstSnipDetected ? 'Go to Dashboard' : 'I\'ll Try Later'}
            </Button>
          </div>

          {/* Helpful note */}
          {!firstSnipDetected && (
            <div className="mt-8 p-4 bg-accent/10 border border-accent/30 rounded-lg text-center">
              <p className="text-sm text-text-secondary">
                Don't worry, you can always access the tutorial from your dashboard settings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
