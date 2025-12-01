'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '../components/Navigation';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { BarChart3, Clock, Shield } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await api.getMe(token);
      if (response.success && response.data?.user) {
        const user = response.data.user;
        // Check if user has admin role
        if ((user as any).role === 'ADMIN') {
          setIsAdmin(true);
        } else {
          // Not an admin, redirect to dashboard
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('[ADMIN] Auth error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
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

  if (!isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 pt-20 sm:pt-24 lg:pt-32 pb-12">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 via-orange-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center border-2 border-orange-500/30">
              <Shield className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-text-secondary">Monitor and analyze FratGPT usage and costs</p>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border pb-2">
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
              pathname === '/admin/dashboard'
                ? 'bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-b-2 border-orange-500 text-orange-500'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </Link>
          <Link
            href="/admin/analytics"
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
              pathname === '/admin/analytics'
                ? 'bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-b-2 border-orange-500 text-orange-500'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </Link>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
