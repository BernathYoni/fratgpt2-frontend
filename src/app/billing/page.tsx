'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function BillingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await api.getSubscriptionStatus(token);
      if (res.success) setSubscription(res.data);
    } catch (err) {
      console.error('Failed to load subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    const token = getToken();
    if (!token) return;

    const res = await api.getCustomerPortalUrl(token);
    if (res.success && res.data?.url) {
      window.location.href = res.data.url;
    }
  };

  if (loading) {
    return (
      <DashboardLayout active="billing">
        <div className="flex items-center justify-center h-64">
          <div className="text-text-secondary">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  const isUnlimited = subscription?.plan === 'unlimited';

  return (
    <DashboardLayout active="billing">
      <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

      <div className="space-y-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-bold text-accent mb-2">
                {isUnlimited ? 'Unlimited' : 'Basic'} Plan
              </p>
              <p className="text-text-secondary">
                ${isUnlimited ? '12' : '5'}/month
              </p>
              <p className="text-text-muted text-sm mt-2">
                Status: <span className="text-success">{subscription?.status || 'Active'}</span>
              </p>
            </div>
            <div className="text-right">
              <Button onClick={openCustomerPortal} variant="outline">
                Manage Subscription
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <p className="text-text-secondary mb-4">
            Manage your payment methods, view invoices, and update billing information through the Stripe Customer Portal.
          </p>
          <Button onClick={openCustomerPortal} variant="outline">
            Open Billing Portal
          </Button>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
          <p className="text-text-secondary mb-4">
            Have questions about your billing? Contact our support team.
          </p>
          <Button variant="ghost">
            Contact Support
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
