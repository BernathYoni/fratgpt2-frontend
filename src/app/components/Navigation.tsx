'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';
import { removeToken } from '@/lib/auth';
import { api } from '@/lib/api';
import { Menu, X, ChevronDown, Settings, History, LogOut, Shield } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: 'USER' | 'ADMIN';
}

export function Navigation() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Close dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener('fratgpt-auth-change', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('fratgpt-auth-change', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('mousedown', handleClickOutside);
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

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <nav className="border-b border-border bg-background backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="px-4 sm:px-8 lg:px-16">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl sm:text-3xl font-bold text-accent hover:text-accent-hover transition-colors">
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
            <Link href="/" className="text-lg text-text-secondary hover:text-text-primary transition-colors">
              Home
            </Link>
            <Link href="/subscribe" className="text-lg text-text-secondary hover:text-text-primary transition-colors">
              Plans
            </Link>
            <Link href="/#testimonials" className="text-lg text-text-secondary hover:text-text-primary transition-colors">
              Reviews
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" className="px-3 py-1.5 rounded-md text-lg font-medium text-white bg-accent hover:bg-accent-hover transition-all shadow-sm">
                  Dashboard
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-surface hover:bg-surface-hover border border-border transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.first_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="text-lg font-medium text-text-primary">
                      {(user.first_name ? user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1) : null) || user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-xl py-2 z-50">
                      {user.role === 'ADMIN' && (
                        <>
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2.5 text-text-primary bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-b border-orange-500/20 hover:from-orange-500/20 hover:to-yellow-500/20 transition-colors"
                          >
                            <Shield className="w-5 h-5 text-accent" />
                            <span className="font-semibold text-accent">Admin Dashboard</span>
                          </Link>
                          <div className="border-t border-border my-2"></div>
                        </>
                      )}
                      <Link
                        href="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-text-primary hover:bg-surface-hover transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        href="/history"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-text-primary hover:bg-surface-hover transition-colors"
                      >
                        <History className="w-5 h-5" />
                        <span>History</span>
                      </Link>
                      <div className="border-t border-border my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2.5 text-error hover:bg-error/5 transition-colors w-full text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-lg text-text-secondary hover:text-text-primary transition-colors">
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
              className="block text-base text-text-secondary hover:text-text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/subscribe"
              className="block text-base text-text-secondary hover:text-text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Plans
            </Link>
            <Link
              href="/#testimonials"
              className="block text-base text-text-secondary hover:text-text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reviews
            </Link>

            {user ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-surface border border-border">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.first_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-base font-medium text-text-primary">
                    {(user.first_name ? user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1) : null) || user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 rounded-md text-base font-medium text-white bg-accent hover:bg-accent-hover transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center space-x-3 px-4 py-2 rounded-md text-base font-medium bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 text-accent hover:border-orange-500/50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Link
                  href="/settings"
                  className="flex items-center space-x-3 text-base text-text-secondary hover:text-text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
                <Link
                  href="/history"
                  className="flex items-center space-x-3 text-base text-text-secondary hover:text-text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <History className="w-5 h-5" />
                  <span>History</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-3 text-base text-error hover:text-error/80 transition-colors py-2 w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-base text-text-secondary hover:text-text-primary transition-colors py-2"
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
