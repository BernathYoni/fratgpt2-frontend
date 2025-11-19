'use client';

import Link from 'next/link';
import { Home, History, CreditCard, Settings } from 'lucide-react';
import { Navigation } from '../Navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  active?: 'dashboard' | 'history' | 'billing' | 'settings';
}

export function DashboardLayout({ children, active = 'dashboard' }: DashboardLayoutProps) {
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard', key: 'dashboard' },
    { href: '/history', icon: History, label: 'History', key: 'history' },
    { href: '/billing', icon: CreditCard, label: 'Billing', key: 'billing' },
    { href: '/settings', icon: Settings, label: 'Settings', key: 'settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-surface border-r border-border flex flex-col">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold text-accent">FratGPT</Link>
        </div>

        <nav className="flex-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
