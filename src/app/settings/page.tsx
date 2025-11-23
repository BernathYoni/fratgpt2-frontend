'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/Button';
import { getToken, removeToken } from '@/lib/auth';
import { api } from '@/lib/api';
import { X } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  subscription?: {
    status: string;
    stripe_price_id?: string;
    current_period_end?: string;
    cancel_at_period_end?: boolean;
  };
  plan?: string;
  usage?: {
    used: number;
    limit: number;
    remaining: number;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [cancelStep, setCancelStep] = useState<'main' | 'confirm' | 'feedback' | 'processing'>('main');
  const [cancelReason, setCancelReason] = useState('');
  const [cancelFeedback, setCancelFeedback] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await api.getMe(token);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        removeToken();
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      setError('Failed to load account information');
    } finally {
      setLoading(false);
    }
  }

  async function handleManageBilling() {
    // Directly open Stripe customer portal instead of showing modal
    await handleOpenStripePortal();
  }

  async function handleCancelSubscription() {
    const token = getToken();
    if (!token) return;

    setCancelStep('processing');
    setError('');

    try {
      const response = await api.getCustomerPortalUrl(token);
      if (response.success && response.data?.url) {
        // Open Stripe portal in new tab for actual cancellation
        window.open(response.data.url, '_blank');
        setShowBillingModal(false);
        setCancelStep('main');
        setCancelReason('');
        setCancelFeedback('');
      } else {
        setError('Failed to process cancellation. Please try again.');
        setCancelStep('feedback');
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      setError('Failed to process cancellation. Please try again.');
      setCancelStep('feedback');
    }
  }

  async function handleOpenStripePortal() {
    const token = getToken();
    if (!token) return;

    setBillingLoading(true);
    setError('');

    try {
      const response = await api.getCustomerPortalUrl(token);
      if (response.success && response.data?.url) {
        // Open in new tab so user stays on settings page
        window.open(response.data.url, '_blank');
      } else {
        setError('Failed to open billing portal. Please try again.');
      }
    } catch (error) {
      console.error('Billing portal error:', error);
      setError('Failed to open billing portal. Please try again.');
    } finally {
      setBillingLoading(false);
    }
  }

  function handleLogout() {
    removeToken();
    router.push('/');
  }

  function getPlanDisplay(plan?: string): string {
    if (!plan || plan === 'free') return 'Free Plan';
    return plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan';
  }

  function getPlanColor(plan?: string): string {
    switch (plan) {
      case 'pro':
        return 'from-pink-500 to-purple-500';
      case 'basic':
        return 'from-orange-500 to-yellow-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center pt-28 min-h-screen">
          <div className="text-text-secondary text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-4xl mx-auto px-6 pt-20 sm:pt-24 lg:pt-32 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-text-primary">
            Account Settings
          </h1>
          <p className="text-text-secondary text-lg">Manage your account and subscription</p>
        </div>

        {error && (
          <div className="mb-6 bg-error/10 border border-error text-error px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {user?.first_name?.[0]?.toUpperCase() || user?.email[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-xl font-semibold">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user?.first_name || user?.email.split('@')[0]}
                  </div>
                  <div className="text-text-secondary">{user?.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Subscription</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                    <span
                      className={`px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r ${getPlanColor(
                        user?.plan
                      )}`}
                    >
                      {getPlanDisplay(user?.plan)}
                    </span>
                    {user?.subscription?.cancel_at_period_end && (
                      <span className="px-3 py-1 rounded-md text-sm bg-error/20 text-error border border-error/30">
                        Cancels at period end
                      </span>
                    )}
                  </div>
                  {user?.usage && (
                    <div className="text-text-secondary">
                      <span className="font-medium text-text-primary">{user.usage.used}</span> /{' '}
                      {user.usage.limit} solves used today
                      <span className="ml-2 text-sm">
                        ({user.usage.remaining} remaining)
                      </span>
                    </div>
                  )}
                  {user?.subscription?.current_period_end && (
                    <div className="text-text-secondary text-sm mt-1">
                      {user.subscription.cancel_at_period_end ? 'Active until' : 'Renews on'}{' '}
                      {new Date(user.subscription.current_period_end).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  {user?.plan === 'free' ? (
                    <Button
                      onClick={() => router.push('/subscribe')}
                      className="bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500"
                    >
                      Upgrade Plan
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleManageBilling}
                        disabled={billingLoading}
                        className="bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500"
                      >
                        {billingLoading ? 'Loading...' : 'Manage Subscription'}
                      </Button>
                      <p className="text-xs text-text-secondary text-center">
                        Update payment, cancel, or change plan
                      </p>
                    </>
                  )}
                </div>
              </div>

              {user?.plan === 'free' && (
                <div className="mt-4 p-4 bg-gradient-to-r from-pink-500/10 via-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-lg">
                  <p className="text-sm text-text-secondary">
                    Upgrade to unlock more daily solves, priority support, and advanced features.
                  </p>
                </div>
              )}
            </div>
          </div>


          {/* Danger Zone */}
          <div className="bg-surface border border-error/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-error">Danger Zone</h2>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="font-semibold mb-1">Log Out</div>
                <div className="text-text-secondary text-sm">
                  Sign out of your account on this device
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline" className="border-error text-error hover:bg-error/10">
                Log Out
              </Button>
            </div>
          </div>
        </div>

        {/* Billing Management Modal */}
        {showBillingModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-2xl font-bold">Billing Management</h2>
                <button
                  onClick={() => {
                    setShowBillingModal(false);
                    setCancelStep('main');
                    setCancelReason('');
                    setCancelFeedback('');
                  }}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {cancelStep === 'main' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Current Subscription</h3>
                      <div className="bg-gradient-to-r from-pink-500/10 via-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-lg p-4">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <div className={`inline-block px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r ${getPlanColor(user?.plan)} mb-2`}>
                              {getPlanDisplay(user?.plan)}
                            </div>
                            {user?.subscription?.current_period_end && (
                              <div className="text-sm text-text-secondary">
                                {user.subscription.cancel_at_period_end ? 'Active until' : 'Renews on'}{' '}
                                {new Date(user.subscription.current_period_end).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleOpenStripePortal}
                        className="w-full bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 hover:from-pink-600 hover:via-orange-600 hover:to-yellow-600"
                        disabled={billingLoading}
                      >
                        {billingLoading ? 'Loading...' : 'Update Payment Method'}
                      </Button>

                      <Button
                        onClick={handleOpenStripePortal}
                        variant="outline"
                        className="w-full"
                        disabled={billingLoading}
                      >
                        View Invoices & Receipts
                      </Button>

                      {user?.plan !== 'pro' && (
                        <Button
                          onClick={() => router.push('/subscribe')}
                          variant="outline"
                          className="w-full border-green-500 text-green-500 hover:bg-green-500/10"
                        >
                          Upgrade Plan
                        </Button>
                      )}

                      <div className="pt-4 border-t border-border mt-4">
                        <Button
                          onClick={() => setCancelStep('confirm')}
                          variant="outline"
                          className="w-full border-error/50 text-error hover:bg-error/10"
                        >
                          Cancel Subscription
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {cancelStep === 'confirm' && (
                  <div className="space-y-6">
                    <div className="text-center py-6">
                      <div className="text-6xl mb-4">😢</div>
                      <h3 className="text-2xl font-bold mb-3">We're Sorry to See You Go!</h3>
                      <p className="text-text-secondary text-lg">
                        Before you cancel, here's what you'll lose:
                      </p>
                    </div>

                    <div className="bg-error/10 border border-error/30 rounded-lg p-6 space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">❌</div>
                        <div>
                          <div className="font-semibold text-lg">
                            {user?.plan === 'pro' ? 'Unlimited' : '50'} Daily Solves
                          </div>
                          <div className="text-sm text-text-secondary">
                            You'll drop back to just 20 solves per day
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">❌</div>
                        <div>
                          <div className="font-semibold text-lg">Follow-up Questions</div>
                          <div className="text-sm text-text-secondary">
                            No more AI chat to help you understand concepts
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">❌</div>
                        <div>
                          <div className="font-semibold text-lg">Solve History</div>
                          <div className="text-sm text-text-secondary">
                            Access to your previous solutions will be removed
                          </div>
                        </div>
                      </div>
                      {user?.plan === 'pro' && (
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">❌</div>
                          <div>
                            <div className="font-semibold text-lg">Priority Support</div>
                            <div className="text-sm text-text-secondary">
                              You'll lose access to priority customer support
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-6">
                      <div className="text-center">
                        <div className="text-3xl mb-3">💡</div>
                        <h4 className="font-semibold text-lg mb-2">Did you know?</h4>
                        <p className="text-text-secondary mb-4">
                          Most students who cancel end up resubscribing within 2 weeks when they realize how much time FratGPT saves them.
                        </p>
                        <p className="text-sm text-text-secondary">
                          You're currently saving an average of <span className="font-bold text-green-500">3+ hours per week</span> on homework!
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={() => {
                          setShowBillingModal(false);
                          setCancelStep('main');
                        }}
                        className="flex-1 bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500"
                      >
                        Keep My Subscription
                      </Button>
                      <Button
                        onClick={() => setCancelStep('feedback')}
                        variant="outline"
                        className="flex-1 border-error text-error hover:bg-error/10"
                      >
                        Continue Canceling
                      </Button>
                    </div>
                  </div>
                )}

                {cancelStep === 'feedback' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-3">Help Us Improve</h3>
                      <p className="text-text-secondary mb-4">
                        We'd love to understand why you're leaving. Your feedback helps us serve students better.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="block">
                        <span className="text-sm font-medium mb-2 block">Why are you canceling?</span>
                        <select
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          <option value="">Select a reason...</option>
                          <option value="too-expensive">Too expensive</option>
                          <option value="not-using">Not using it enough</option>
                          <option value="technical-issues">Technical issues</option>
                          <option value="found-alternative">Found an alternative</option>
                          <option value="finished-semester">Finished semester</option>
                          <option value="other">Other</option>
                        </select>
                      </label>

                      <label className="block">
                        <span className="text-sm font-medium mb-2 block">Additional feedback (optional)</span>
                        <textarea
                          value={cancelFeedback}
                          onChange={(e) => setCancelFeedback(e.target.value)}
                          placeholder="Tell us more about your experience..."
                          rows={4}
                          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                        />
                      </label>
                    </div>

                    {cancelReason === 'too-expensive' && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-3xl mb-3">🎁</div>
                          <h4 className="font-semibold text-lg mb-2">Special Offer!</h4>
                          <p className="text-text-secondary mb-4">
                            We'd like to offer you <span className="font-bold text-green-500">50% off for the next 3 months</span> to keep you as a valued member!
                          </p>
                          <Button
                            onClick={() => {
                              alert('Discount applied! Please contact support@fratgpt.com to activate your discount.');
                              setShowBillingModal(false);
                              setCancelStep('main');
                            }}
                            className="bg-gradient-to-r from-green-500 to-blue-500"
                          >
                            Claim 50% Off
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <Button
                        onClick={() => setCancelStep('confirm')}
                        variant="outline"
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleCancelSubscription}
                        disabled={!cancelReason}
                        variant="outline"
                        className="flex-1 border-error text-error hover:bg-error/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancelReason ? 'Proceed to Stripe Portal' : 'Please Select Reason'}
                      </Button>
                    </div>
                  </div>
                )}

                {cancelStep === 'processing' && (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-border border-t-pink-500 mb-4"></div>
                    <p className="text-text-secondary">Opening Stripe portal...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
