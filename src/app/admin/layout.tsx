'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '../components/Navigation';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
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
        {children}
      </div>
    </div>
  );
}