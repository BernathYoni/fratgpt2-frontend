'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { removeToken } from '@/lib/auth';
import { api } from '@/lib/api';
import { Menu, X } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize user from cache immediately to prevent flicker
  const [user, setUser] = useState<UserData | null>(() => {
    if (typeof window === 'undefined') return null;
    const cached = localStorage.getItem('cachedUser');
    const token = localStorage.getItem('authToken');
    // Only use cache if token exists
    if (cached && token) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    console.log('[Navigation] Mounted - checking auth');
    checkAuth();

    // Listen for auth changes from same tab (website-sync dispatches these)
    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log('[Navigation] Auth change:', customEvent.detail?.action);

      if (customEvent.detail?.action === 'logout') {
        console.log('[Navigation] Logout detected');
        setUser(null);
        // Clear cached user data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cachedUser');
        }
      } else if (customEvent.detail?.action === 'login') {
        console.log('[Navigation] Login detected');
        checkAuth();
      }
    };

    // Listen for auth changes from other tabs (storage event)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        console.log('[Navigation] Storage change - token:', !!e.newValue);

        if (!e.newValue) {
          // Logged out in another tab
          setUser(null);
          // Clear cached user data
          localStorage.removeItem('cachedUser');
        } else {
          // Logged in another tab
          checkAuth();
        }
      }
    };

    window.addEventListener('fratgpt-auth-change', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('fratgpt-auth-change', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  async function checkAuth() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    console.log('[Navigation] Checking auth - has token:', !!token);

    if (!token) {
      setUser(null);
      // Clear cached user data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cachedUser');
      }
      return;
    }

    try {
      const response = await api.getMe(token);

      if (response.success && response.data?.user) {
        const userData = response.data.user;
        console.log('[Navigation] ✓ Authenticated:', userData.email);

        // Only update state if user data actually changed (prevents unnecessary re-renders)
        setUser(prevUser => {
          if (!prevUser || prevUser.id !== userData.id || prevUser.email !== userData.email) {
            return userData;
          }
          return prevUser;
        });

        // Cache user data for instant loading on next page
        if (typeof window !== 'undefined') {
          localStorage.setItem('cachedUser', JSON.stringify(userData));
        }
      } else {
        console.warn('[Navigation] ✗ Invalid token');
        removeToken();
        setUser(null);
        // Clear cached user data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cachedUser');
        }
      }
    } catch (error) {
      console.error('[Navigation] Auth error:', error);
      removeToken();
      setUser(null);
      // Clear cached user data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cachedUser');
      }
    }
  }

  return (
    <nav className="border-b border-border bg-background backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="px-4 sm:px-8 lg:px-16">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              FratGPT
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-lg text-text-secondary hover:text-pink-500 transition-colors">
              Home
            </Link>
            <Link href="/subscribe" className="text-lg text-text-secondary hover:text-purple-500 transition-colors">
              Plans
            </Link>
            <Link href="/#testimonials" className="text-lg text-text-secondary hover:text-yellow-500 transition-colors">
              Reviews
            </Link>

            {user ? (
              <>
                <Link href="/settings" className="text-lg text-text-secondary hover:text-yellow-500 transition-colors">
                  Settings
                </Link>
                <Link href="/dashboard" className="px-3 py-1.5 rounded-md text-lg font-medium text-white bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 transition-all shadow-sm">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500/10 via-orange-500/10 to-yellow-500/10 border border-orange-500/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.first_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-lg font-medium bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    {(user.first_name ? user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1) : null) || user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-lg text-text-secondary hover:text-yellow-500 transition-colors">
                  Login
                </Link>
                <Link href="/signup">
                  <Button size="md">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-4">
            <Link
              href="/"
              className="block text-base text-text-secondary hover:text-pink-500 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/subscribe"
              className="block text-base text-text-secondary hover:text-purple-500 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Plans
            </Link>
            <Link
              href="/#testimonials"
              className="block text-base text-text-secondary hover:text-yellow-500 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reviews
            </Link>

            {user ? (
              <>
                <Link
                  href="/settings"
                  className="block text-base text-text-secondary hover:text-yellow-500 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-pink-500 to-orange-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-500/10 via-orange-500/10 to-yellow-500/10 border border-orange-500/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.first_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-base font-medium bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    {(user.first_name ? user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1) : null) || user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-base text-text-secondary hover:text-yellow-500 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="md" className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
