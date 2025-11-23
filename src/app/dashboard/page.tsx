'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '../components/Navigation';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { TrendingUp, Zap, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    console.log('[DASHBOARD] 📊 Loading dashboard data...');

    const token = getToken();
    console.log('[DASHBOARD] Checking auth token...');

    if (!token) {
      console.error('[DASHBOARD] ❌ No token found! Redirecting to login...');
      router.push('/login');
      return;
    }

    console.log('[DASHBOARD] ✓ Token found, loading user data...');

    try {
      console.log('[DASHBOARD] 🌐 Fetching user, subscription, usage, and history...');
      const [userRes, subRes, usageRes, historyRes] = await Promise.all([
        api.getMe(token),
        api.getSubscriptionStatus(token),
        api.getUsageStats(token),
        api.getSolveHistory(token),
      ]);

      console.log('[DASHBOARD] User response:', userRes.success ? 'SUCCESS' : 'FAILED');
      console.log('[DASHBOARD] Subscription response:', subRes.success ? 'SUCCESS' : 'FAILED');
      console.log('[DASHBOARD] Usage response:', usageRes.success ? 'SUCCESS' : 'FAILED');
      console.log('[DASHBOARD] History response:', historyRes.success ? 'SUCCESS' : 'FAILED');

      if (userRes.success) {
        console.log('[DASHBOARD] ✓ User data loaded:', userRes.data?.user?.email);
        setUser(userRes.data);
      }
      if (subRes.success) {
        console.log('[DASHBOARD] ✓ Subscription plan:', subRes.data?.plan);
        setSubscription(subRes.data);
      }
      if (usageRes.success) {
        console.log('[DASHBOARD] ✓ Usage stats loaded');
        setUsage(usageRes.data);
      }
      if (historyRes.success && historyRes.data) {
        const historyData = Array.isArray(historyRes.data) ? historyRes.data : (historyRes.data as any).history || [];
        console.log('[DASHBOARD] ✓ History loaded, items:', historyData.length);
        setHistory(historyData);
      }

      console.log('[DASHBOARD] ✅ Dashboard data loaded successfully');
    } catch (err) {
      console.error('[DASHBOARD] ❌ Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (plan: 'basic' | 'pro') => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    setCheckoutLoading(plan);

    try {
      const response = await api.createCheckoutSession(token, plan);
      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        const errorMsg = response.error || 'Failed to start checkout. Please try again.';
        console.error('Checkout error:', errorMsg);
        alert(errorMsg);
        setCheckoutLoading(null);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to start checkout. Please try again.';
      console.error('Checkout error:', error);
      alert(errorMsg);
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 pt-20 sm:pt-24 lg:pt-32 pb-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-text-secondary">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const hasSubscription = subscription?.hasSubscription;
  const userPlan = subscription?.plan || 'free';
  const todayUsage = usage?.today || 0;

  // Set daily limit based on actual plan
  let dailyLimitNumber = 20; // free plan default
  if (userPlan === 'basic') dailyLimitNumber = 50;
  if (userPlan === 'pro' || userPlan === 'unlimited') dailyLimitNumber = 500;

  const dailyLimit = dailyLimitNumber;
  const usagePercent = (todayUsage / dailyLimitNumber) * 100;

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 pt-20 sm:pt-24 lg:pt-32 pb-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Zap className="w-6 h-6" />}
          label="Today's Usage"
          value={userPlan === 'pro' ? `${todayUsage} / Unlimited` : `${todayUsage} / ${dailyLimit}`}
          subtext={userPlan === 'pro' ? 'No daily limit' : `${dailyLimitNumber - todayUsage} remaining`}
          percentage={usagePercent}
          type="usage"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Total Solves"
          value={usage?.total || 0}
          subtext="All time"
          type="total"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          label="Current Plan"
          value={userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
          subtext={subscription?.status || 'No subscription'}
          type="plan"
        />
      </div>

      {!hasSubscription && (
        <div className="bg-accent/10 border border-accent rounded-xl p-9 mb-8">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-shrink-0">
              <h2 className="text-xl font-semibold mb-2">No Active Subscription</h2>
              <p className="text-text-secondary">Subscribe to start solving homework problems</p>
            </div>
            <div className="flex gap-4">
              {/* Basic Plan Button - Prominent */}
              <button
                onClick={() => handleSelectPlan('basic')}
                disabled={checkoutLoading === 'basic'}
                className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 hover:from-orange-500/20 hover:to-yellow-500/20 border-2 border-orange-500/30 hover:border-orange-500/50 rounded-lg px-6 py-4 transition-all min-w-[160px] text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-xs text-orange-400 font-semibold uppercase tracking-wide mb-1">
                  {checkoutLoading === 'basic' ? 'Loading...' : 'Basic'}
                </div>
                <div className="text-2xl font-bold mb-1">$9.99</div>
                <div className="text-sm bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent font-semibold">50 solves/day</div>
              </button>

              {/* Pro Plan Button - Less Prominent */}
              <button
                onClick={() => handleSelectPlan('pro')}
                disabled={checkoutLoading === 'pro'}
                className="bg-gradient-to-br from-orange-500/5 to-yellow-500/5 hover:from-orange-500/10 hover:to-yellow-500/10 border border-orange-500/20 hover:border-orange-500/40 rounded-lg px-6 py-4 transition-all min-w-[160px] text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-xs text-text-muted uppercase tracking-wide mb-1">
                  {checkoutLoading === 'pro' ? 'Loading...' : 'Pro'}
                </div>
                <div className="text-2xl font-bold mb-1">$19.99</div>
                <div className="text-sm text-text-secondary">Unlimited</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Usage Progress */}
      {hasSubscription && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Daily Usage</h2>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-text-secondary">Used: {todayUsage} / {dailyLimitNumber}</span>
            <span className="text-text-secondary">{Math.round(usagePercent)}%</span>
          </div>
          <div className="w-full bg-surface-hover rounded-full h-3">
            <div
              className="bg-accent h-3 rounded-full transition-all"
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          {userPlan !== 'pro' && todayUsage >= dailyLimitNumber * 0.9 && (
            <p className="mt-4 text-sm text-text-secondary">
              Running low on daily solves?{' '}
              <Link href="/subscribe" className="text-accent hover:underline">
                Upgrade to Pro
              </Link>
            </p>
          )}
        </Card>
      )}

      {/* History Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Recent Solve History</h2>
        {history.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-text-secondary mb-4">No solve history yet</p>
              <p className="text-text-muted text-sm">
                Start using the extension to see your solutions here
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.slice(0, 10).map((item, idx) => (
              <Card key={idx} hover>
                <div className="flex items-start gap-4">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt="Problem"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm text-text-muted">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                      <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                        {item.mode}
                      </span>
                    </div>
                    <p className="text-text-primary">{item.answer || 'Answer not available'}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  percentage,
  type,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext: string;
  percentage?: number;
  type?: 'usage' | 'total' | 'plan';
}) {
  return (
    <Card>
      <div className="flex items-center gap-6">
        {/* Left side - Visual representation */}
        <div className="flex-shrink-0">
          {type === 'usage' && percentage !== undefined && (
            <div className="relative w-24 h-24">
              {/* Background circle */}
              <svg className="transform -rotate-90 w-24 h-24">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-accent/20"
                />
                {/* Progress circle */}
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                  className="text-accent transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              {/* Percentage text in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-accent">{Math.round(percentage)}%</span>
              </div>
            </div>
          )}

          {type === 'total' && (
            <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center">
              <div className="text-accent">
                <TrendingUp className="w-12 h-12" />
              </div>
            </div>
          )}

          {type === 'plan' && (
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500/20 via-orange-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center border-2 border-accent/30">
              <div className="text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text">
                <Calendar className="w-12 h-12" style={{ color: 'transparent', stroke: 'url(#gradient)' }} />
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="50%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#eab308" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Text content */}
        <div className="flex-1 min-w-0">
          <p className="text-text-secondary text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold mb-1 truncate">{value}</p>
          <p className="text-text-muted text-sm">{subtext}</p>
        </div>
      </div>
    </Card>
  );
}
