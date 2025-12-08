'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Navigation } from '../components/Navigation';
import { Check, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { getToken, isAuthenticated } from '@/lib/auth';

function SubscribeContent() {
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get('plan');
  const router = useRouter();

  const [currentPlan, setCurrentPlan] = useState<'free' | 'basic' | 'pro' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false); // User just signed up, selecting plan for first time

  useEffect(() => {
    async function fetchUserPlan() {
      // Small delay to ensure token from signup is saved
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('[SUBSCRIBE] 🔍 Checking user authentication...');
      console.log('[SUBSCRIBE] localStorage authToken on page load:', localStorage.getItem('authToken') ? 'EXISTS' : 'MISSING');

      // Check if user just signed up (flag set by signup page)
      const justSignedUp = localStorage.getItem('just_signed_up') === 'true';
      if (justSignedUp) {
        console.log('[SUBSCRIBE] 🆕 User just signed up, selecting plan for first time');
        setIsNewUser(true);
        localStorage.removeItem('just_signed_up'); // Clear flag
      }

      const token = getToken();

      if (!token) {
        console.log('[SUBSCRIBE] ❌ No token found, user not logged in');
        setCurrentPlan(null);
        setIsLoading(false);
        return;
      }

      console.log('[SUBSCRIBE] ✓ Token found:', token.substring(0, 20) + '...');
      console.log('[SUBSCRIBE] 🌐 Fetching user subscription status...');

      // Fetch subscription status only
      const subscriptionResponse = await api.getSubscriptionStatus(token);

      if (subscriptionResponse.success && subscriptionResponse.data) {
        const plan = subscriptionResponse.data.plan || 'free';
        console.log('[SUBSCRIBE] ✓ Current plan:', plan);
        setCurrentPlan(plan);
      } else {
        console.log('[SUBSCRIBE] ⚠️  No subscription data, defaulting to free');
        setCurrentPlan('free');
      }

      setIsLoading(false);
      console.log('[SUBSCRIBE] ✓ User plan fetch complete');
    }

    console.log('[SUBSCRIBE] 📍 Component mounted, fetching user plan...');
    fetchUserPlan();

    // Listen for auth changes (e.g., user just signed up)
    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log('[SUBSCRIBE] 🔔 Auth change event received:', customEvent.detail?.action);
      if (customEvent.detail?.action === 'login') {
        // User just logged in, re-fetch their plan
        console.log('[SUBSCRIBE] 🔄 Re-fetching user plan after login...');
        fetchUserPlan();
      }
    };

    window.addEventListener('fratgpt-auth-change', handleAuthChange);
    return () => window.removeEventListener('fratgpt-auth-change', handleAuthChange);
  }, []);

  const handlePlanClick = async (plan: 'free' | 'basic' | 'pro') => {
    console.log('[SUBSCRIBE] 🎯 Plan clicked:', plan);

    // Wait for loading to complete before processing click
    if (isLoading) {
      console.log('[SUBSCRIBE] ⏳ Still loading, please wait...');
      return;
    }

    // If not logged in, redirect to signup with plan pre-selected
    console.log('[SUBSCRIBE] Checking authentication...');
    const token = getToken();
    console.log('[SUBSCRIBE] Token check result:', token ? `Found: ${token.substring(0, 20)}...` : 'NOT FOUND');
    console.log('[SUBSCRIBE] localStorage authToken:', localStorage.getItem('authToken') ? 'EXISTS' : 'MISSING');
    console.log('[SUBSCRIBE] currentPlan:', currentPlan);
    console.log('[SUBSCRIBE] isLoading:', isLoading);

    if (!token) {
      console.log('[SUBSCRIBE] ❌ User NOT logged in, redirecting to signup with plan...');
      // Clear any old stored plan first
      localStorage.removeItem('selected_plan');
      // Store new plan in localStorage for immediate access after signup
      localStorage.setItem('selected_plan', plan);
      router.push(`/signup?plan=${plan}`);
      return;
    }

    console.log('[SUBSCRIBE] ✓ User IS authenticated with token');

    // If clicking current plan, do nothing UNLESS it's free plan and user is new
    if (currentPlan === plan && !(plan === 'free' && isNewUser)) {
      console.log('[SUBSCRIBE] Already on this plan, ignoring click');
      return;
    }

    // Determine plan tiers for comparison
    const planTiers = { free: 0, basic: 1, pro: 2 };
    const currentTier = planTiers[currentPlan || 'free'];
    const targetTier = planTiers[plan];

    // DOWNGRADE: Redirect to Stripe customer portal
    if (targetTier < currentTier) {
      setIsUpgrading(true);
      const token = getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await api.getCustomerPortalUrl(token);
      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        alert('Failed to open billing portal. Please try again from settings.');
        setIsUpgrading(false);
      }
      return;
    }

    // Free plan clicked
    if (plan === 'free') {
      // If already logged in, go directly to dashboard
      if (isAuthenticated()) {
        console.log('[SUBSCRIBE] ✓ Already logged in with free plan, redirecting to dashboard...');
        router.push('/dashboard');
        return;
      }

      // Not logged in - redirect to signup
      console.log('[SUBSCRIBE] Not logged in, redirecting to signup with free plan...');
      localStorage.setItem('selected_plan', plan);
      router.push('/signup?plan=free');
      return;
    }

    // UPGRADE: Create Stripe checkout session
    console.log('[SUBSCRIBE] ✓ User IS logged in, creating checkout session...');
    setIsUpgrading(true);
    // token already retrieved above at line 90

    console.log('[SUBSCRIBE] 🌐 Calling createCheckoutSession API...');
    
    // Get affiliate code if exists
    const affiliateCode = localStorage.getItem('fratgpt_affiliate_ref') || undefined;
    if (affiliateCode) console.log('[SUBSCRIBE] Applying affiliate code:', affiliateCode);

    const response = await api.createCheckoutSession(token, plan, affiliateCode);
    console.log('[SUBSCRIBE] Checkout response:', response.success ? 'SUCCESS' : 'FAILED');

    if (response.success && response.data?.url) {
      console.log('[SUBSCRIBE] ✓ Redirecting to Stripe checkout...');
      console.log('[SUBSCRIBE] Stripe URL:', response.data.url);
      window.location.href = response.data.url;
    } else {
      console.error('[SUBSCRIBE] ❌ Checkout failed:', response.error);
      alert(response.error || 'Failed to start checkout. Please try again.');
      setIsUpgrading(false);
    }
  };

  const getPlanButton = (plan: 'free' | 'basic' | 'pro') => {
    const isCurrent = currentPlan === plan;
    const isLoggedIn = isAuthenticated();

    // Special case: Free plan when user just signed up
    // Show "Continue with Free" instead of "Current"
    if (isCurrent && isLoggedIn && plan === 'free' && isNewUser) {
      return (
        <Button
          variant="outline"
          className="w-full text-sm py-2.5 font-bold"
          onClick={() => handlePlanClick('free')}
          disabled={isUpgrading || isLoading}
        >
          {isUpgrading ? 'Processing...' : 'Continue with Free'}
        </Button>
      );
    }

    // Current plan - show "Current" button (disabled)
    if (isCurrent && isLoggedIn) {
      return (
        <Button
          variant="outline"
          className="w-full text-sm py-2.5 font-bold cursor-default opacity-70"
          disabled
        >
          Current
        </Button>
      );
    }

    const planTiers = { free: 0, basic: 1, pro: 2 };
    const currentTier = planTiers[currentPlan || 'free'];
    const targetTier = planTiers[plan];
    const isUpgrade = targetTier > currentTier;
    const isDowngrade = targetTier < currentTier;

    // Determine button text
    let buttonText = 'Subscribe';
    if (isLoading) {
      buttonText = 'Loading...';
    } else if (isUpgrading) {
      buttonText = 'Processing...';
    } else if (!isLoggedIn) {
      // Not logged in - signing up
      buttonText = plan === 'free' ? 'Continue with Free' : 'Subscribe';
    } else if (isNewUser) {
      // New user selecting plan for first time - all plans say "Subscribe"
      buttonText = plan === 'free' ? 'Continue with Free' : 'Subscribe';
    } else if (isDowngrade) {
      buttonText = 'Downgrade';
    } else if (isUpgrade) {
      buttonText = 'Upgrade';
    }

    // Basic plan - special gradient styling ONLY if it's an upgrade or new signup (not downgrade)
    if (plan === 'basic' && !isDowngrade) {
      return (
        <Button
          className="w-full text-sm py-2.5 font-bold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
          onClick={() => handlePlanClick('basic')}
          disabled={isUpgrading || isLoading}
        >
          {buttonText}
        </Button>
      );
    }

    // Free, Pro, and Basic (when downgrade) - outline style
    return (
      <Button
        variant="outline"
        className="w-full text-sm py-2.5 font-bold"
        onClick={() => handlePlanClick(plan)}
        disabled={isUpgrading || isLoading}
      >
        {buttonText}
      </Button>
    );
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-10 overflow-hidden">
        {/* Gradient background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-500/10 to-pink-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 px-8 md:px-16 py-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Choose Your Plan</h1>
            <p className="text-text-secondary text-base">Get started with FratGPT today</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className={`bg-surface border rounded-2xl p-5 transition-all duration-300 shadow-lg flex flex-col relative ${currentPlan === 'free' ? 'border-pink-500' : 'border-border hover:border-pink-500/50'}`}>
              {currentPlan === 'free' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                  CURRENT PLAN
                </div>
              )}
              <div className="mb-5">
                <h2 className="text-xl font-bold mb-2">Free</h2>
                <div className="mb-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">$0</span>
                  <span className="text-text-secondary text-sm">/month</span>
                </div>
                <p className="text-text-secondary text-sm">Try it out with limited access</p>
              </div>

              <ul className="space-y-2.5 mb-5 flex-grow">
                <PlanFeature text="20 solves per month" />
                <PlanFeature text="Fast & Regular modes" />
                <PlanFeature text="Step-by-step explanations" />
                <PlanFeature text="Basic support" />
              </ul>

              {getPlanButton('free')}
            </div>

            {/* Basic Plan - $5/month */}
            <div className={`bg-surface border-2 rounded-2xl p-5 transition-all duration-300 shadow-xl relative flex flex-col ${currentPlan === 'basic' ? 'border-orange-500' : 'border-orange-500/50'}`}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                {currentPlan === 'basic' ? 'CURRENT PLAN' : 'POPULAR'}
              </div>

              <div className="mb-5">
                <h2 className="text-xl font-bold mb-2">Basic</h2>
                <div className="mb-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">$5</span>
                  <span className="text-text-secondary text-sm">/month</span>
                </div>
                <p className="text-text-secondary text-sm">Perfect for regular students</p>
              </div>

              <ul className="space-y-2.5 mb-5 flex-grow">
                <PlanFeature text="Usage-based limit (~$4/month)" highlighted />
                <PlanFeature text="Fast & Regular modes only" />
                <PlanFeature text="Step-by-step explanations" />
                <PlanFeature text="Follow-up questions" />
                <PlanFeature text="Solve history" />
              </ul>

              {getPlanButton('basic')}
            </div>

            {/* Pro Plan - $19.99/month */}
            <div className={`bg-surface border rounded-2xl p-5 transition-all duration-300 shadow-lg relative flex flex-col ${currentPlan === 'pro' ? 'border-yellow-500' : 'border-border hover:border-yellow-500/50'}`}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                {currentPlan === 'pro' ? (
                  'CURRENT PLAN'
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    UNLIMITED
                  </>
                )}
              </div>

              <div className="mb-5">
                <h2 className="text-xl font-bold mb-2">Pro</h2>
                <div className="mb-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-pink-500 bg-clip-text text-transparent">$20</span>
                  <span className="text-text-secondary text-sm">/month</span>
                </div>
                <p className="text-text-secondary text-sm">For serious students</p>
              </div>

              <ul className="space-y-2.5 mb-5 flex-grow">
                <PlanFeature text="Usage-based limit (~$16/month)" highlighted />
                <PlanFeature text="All modes (Fast, Regular, Expert)" highlighted />
                <PlanFeature text="Multi-LLM consensus answers" highlighted />
                <PlanFeature text="Step-by-step explanations" />
                <PlanFeature text="Follow-up questions" />
                <PlanFeature text="Solve history" />
                <PlanFeature text="Priority support" />
              </ul>

              {getPlanButton('pro')}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-base text-text-secondary">Everything you need to know</p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes! Cancel your subscription anytime from your dashboard. No questions asked, no cancellation fees."
            />
            <FAQItem
              question="How does usage-based pricing work?"
              answer="Basic and Pro plans use actual AI costs. Free plan has 20 solves/month. Basic stops at $4 in AI costs (~$5 plan), Pro stops at $16 (~$20 plan). You only pay for what you use!"
            />
            <FAQItem
              question="Do you offer refunds?"
              answer="We offer a 7-day money-back guarantee. If you're not satisfied, we'll refund your first payment."
            />
            <FAQItem
              question="Can I upgrade or downgrade?"
              answer="Yes! You can switch between plans at any time. Changes take effect on your next billing cycle."
            />
            <FAQItem
              question="What happens if I hit my daily limit?"
              answer="On the Free plan, you'll need to wait until the next day or upgrade. On Basic, you can upgrade to Pro for unlimited access anytime."
            />
            <FAQItem
              question="Is my payment secure?"
              answer="Yes, all payments are processed securely through Stripe. We never store your payment information on our servers."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function PlanFeature({ text, highlighted = false }: { text: string; highlighted?: boolean }) {
  return (
    <li className="flex items-start">
      <Check className={`w-4 h-4 mr-2.5 flex-shrink-0 mt-0.5 ${highlighted ? 'text-orange-500' : 'text-pink-500'}`} />
      <span className={`text-sm ${highlighted ? 'font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent' : 'text-text-secondary'}`}>{text}</span>
    </li>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 hover:border-pink-500/50 transition-all duration-300 shadow-lg">
      <h3 className="text-base font-semibold mb-2">{question}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{answer}</p>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-28"><div className="text-text-secondary">Loading...</div></div>}>
      <SubscribeContent />
    </Suspense>
  );
}
