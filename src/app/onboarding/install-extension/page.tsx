'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/app/components/Navigation';
import { Button } from '@/app/components/ui/Button';
import { CheckCircle2, Download, Chrome } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { isAuthenticated } from '@/lib/auth';
import { canInstallExtension } from '@/lib/deviceDetection';

export default function InstallExtensionPage() {
  const router = useRouter();
  const { onboardingCompleted, currentStep, isMobile, updateStep } = useOnboarding();
  const [isChecking, setIsChecking] = useState(false);
  const [extensionInstalled, setExtensionInstalled] = useState(false);

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

    // If already past this step, go to next step
    if (currentStep === 'extension_installed' ||
        currentStep === 'tutorial_completed' ||
        currentStep === 'first_snip_completed') {
      router.push('/onboarding/tutorial');
      return;
    }
  }, [onboardingCompleted, isMobile, currentStep, router]);

  // Check for extension installation via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'FRATGPT_EXTENSION_INSTALLED') {
        setExtensionInstalled(true);
      }
    };

    window.addEventListener('message', handleMessage);

    // Send a ping to check if extension is already installed
    window.postMessage({ type: 'FRATGPT_PING' }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleContinue = async () => {
    if (!extensionInstalled) {
      alert('Please install the extension first to continue');
      return;
    }

    setIsChecking(true);
    const success = await updateStep('extension_installed');

    if (success) {
      router.push('/onboarding/tutorial');
    } else {
      alert('Failed to update onboarding progress. Please try again.');
    }

    setIsChecking(false);
  };

  const handleInstallClick = () => {
    // TODO: Replace with actual Chrome Web Store URL
    const extensionUrl = 'https://chrome.google.com/webstore/detail/fratgpt/YOUR_EXTENSION_ID';
    window.open(extensionUrl, '_blank');

    // Start checking for installation after user clicks
    setTimeout(() => {
      window.postMessage({ type: 'FRATGPT_PING' }, '*');
    }, 2000);
  };

  const browserSupported = canInstallExtension();

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 pt-20">
        <div className="max-w-3xl w-full">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-2">
              <span>Step 1 of 3</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-2 bg-accent rounded-full"></div>
              <div className="flex-1 h-2 bg-surface-hover rounded-full"></div>
              <div className="flex-1 h-2 bg-surface-hover rounded-full"></div>
            </div>
          </div>

          {/* Main content */}
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-xl opacity-50"></div>
                <div className="relative bg-surface border border-border rounded-full p-8">
                  {extensionInstalled ? (
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  ) : (
                    <Download className="w-16 h-16 text-pink-500" />
                  )}
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {extensionInstalled ? 'Extension Installed!' : 'Install FratGPT Extension'}
            </h1>

            {extensionInstalled ? (
              <p className="text-xl text-text-secondary">
                Great! The extension is ready to use. Let's continue with a quick tutorial.
              </p>
            ) : (
              <p className="text-xl text-text-secondary">
                Install our Chrome extension to start solving problems
              </p>
            )}
          </div>

          {!browserSupported && (
            <div className="bg-error/10 border border-error rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <Chrome className="w-6 h-6 text-error flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-error mb-2">Unsupported Browser</h3>
                  <p className="text-sm text-text-secondary">
                    FratGPT requires a Chromium-based browser (Chrome, Edge, Brave) to install the extension.
                    Please switch to a supported browser to continue.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Installation instructions */}
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6">Installation Steps</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full ${extensionInstalled ? 'bg-green-500' : 'bg-gradient-to-br from-pink-500 to-orange-500'} flex items-center justify-center text-white font-bold`}>
                  {extensionInstalled ? '✓' : '1'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-2">Click "Install Extension" button</p>
                  <p className="text-text-secondary text-sm mb-3">
                    This will open the Chrome Web Store in a new tab
                  </p>
                  {!extensionInstalled && (
                    <Button
                      onClick={handleInstallClick}
                      disabled={!browserSupported}
                      className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Install Extension
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-text-secondary font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Add to Chrome</p>
                  <p className="text-text-secondary text-sm">
                    Click "Add to Chrome" on the Chrome Web Store page
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-text-secondary font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Confirm installation</p>
                  <p className="text-text-secondary text-sm">
                    Click "Add extension" when prompted
                  </p>
                </div>
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
              disabled={!extensionInstalled || isChecking}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              {isChecking ? 'Checking...' : 'Continue to Tutorial'}
            </Button>
          </div>

          {!extensionInstalled && (
            <p className="text-center text-sm text-text-muted mt-4">
              The extension will be detected automatically once installed
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
