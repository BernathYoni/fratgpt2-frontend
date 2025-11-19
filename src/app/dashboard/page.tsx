'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowRight, Download, Settings, TrendingUp } from 'lucide-react';

const PRICE_IDS = {
  BASIC: 'price_1SQdkDCDxzHnrj8R0nSwZApT',
  PRO: 'price_1SRQyxCDxzHnrj8RmTIm9ye6',
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, statsData] = await Promise.all([
        api.getMe(),
        api.getUsageStats(),
      ]);
      setUser(userData);
      setStats(statsData);
    } catch (error) {
      // Not authenticated
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (priceId: string) => {
    try {
      const { url } = await api.createCheckoutSession(priceId);
      window.location.href = url;
    } catch (error) {
      alert('Failed to create checkout session');
    }
  };

  const handleManageBilling = async () => {
    try {
      const { url } = await api.createPortalSession();
      window.location.href = url;
    } catch (error) {
      alert('Failed to open billing portal');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fratgpt_token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const plan = user?.plan || 'FREE';
  const usagePercent = stats?.today ? (stats.today.used / stats.dailyLimit) * 100 : 0;
  const isNearLimit = usagePercent >= 80;
  const isAtLimit = usagePercent >= 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">FratGPT 2.0</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Current Plan */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-600">Current Plan</h2>
              <Settings size={20} className="text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {plan === 'PRO' ? 'Pro' : plan === 'BASIC' ? 'Basic' : 'Free'}
            </div>
            <p className="text-sm text-gray-600">
              {stats?.dailyLimit} solves per day
            </p>
            {plan !== 'PRO' && (
              <button
                onClick={() => handleUpgrade(plan === 'FREE' ? PRICE_IDS.BASIC : PRICE_IDS.PRO)}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Upgrade <ArrowRight size={16} />
              </button>
            )}
          </div>

          {/* Today's Usage */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-600">Today's Usage</h2>
              <TrendingUp size={20} className="text-gray-400" />
            </div>
            <div className="text-3xl font-bold mb-2">
              {stats?.today.used || 0} / {stats?.dailyLimit}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full ${
                  isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {stats?.today.remaining || 0} solves remaining today
            </p>
          </div>

          {/* Mode Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-600">Mode Usage Today</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fast</span>
                <span className="font-medium">{stats?.today.byMode.fast || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Regular</span>
                <span className="font-medium">{stats?.today.byMode.regular || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Expert</span>
                <span className="font-medium">{stats?.today.byMode.expert || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Limit Warning */}
        {isNearLimit && !isAtLimit && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800">
              You're approaching your daily limit! Consider upgrading to {plan === 'FREE' ? 'Basic' : 'Pro'} for more solves.
            </p>
            <button
              onClick={() => handleUpgrade(plan === 'FREE' ? PRICE_IDS.BASIC : PRICE_IDS.PRO)}
              className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Upgrade Now
            </button>
          </div>
        )}

        {isAtLimit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800 font-medium">
              You've reached your daily limit of {stats?.dailyLimit} solves.
            </p>
            <p className="text-red-700 mt-1">
              Upgrade to {plan === 'FREE' ? 'Basic (50/day)' : plan === 'BASIC' ? 'Pro (unlimited)' : 'get more solves'}!
            </p>
            {plan !== 'PRO' && (
              <button
                onClick={() => handleUpgrade(plan === 'FREE' ? PRICE_IDS.BASIC : PRICE_IDS.PRO)}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Upgrade Now
              </button>
            )}
          </div>
        )}

        {/* Extension Download */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Download size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Install Chrome Extension</h2>
              <p className="text-gray-600 mb-4">
                Get the FratGPT Chrome extension to screenshot and solve homework problems directly from your browser.
              </p>
              <a
                href="#"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Install Extension
              </a>
            </div>
          </div>
        </div>

        {/* Billing Management */}
        {plan !== 'FREE' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Billing</h2>
            <p className="text-gray-600 mb-4">
              Manage your subscription, update payment methods, and view invoices.
            </p>
            <button
              onClick={handleManageBilling}
              className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50"
            >
              Manage Billing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
