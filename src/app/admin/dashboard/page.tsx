'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { DollarSign, Users, FileText, Link as LinkIcon, Shield, Calendar, Trash2 } from 'lucide-react';
import CostTab from './tabs/CostTab';
import UsersTab from './tabs/UsersTab';
import AffiliatesTab from './tabs/AffiliatesTab';
import LogsTab from './tabs/LogsTab';

type Timeframe = 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'all';
type Tab = 'cost' | 'users' | 'logs' | 'affiliates';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('cost');
  const [timeframe, setTimeframe] = useState<Timeframe>('today');
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [financials, setFinancials] = useState<any>(null);
  const [usersData, setUsersData] = useState<any>(null);
  const [usersPage, setUsersPage] = useState(1);
  const [logsData, setLogsData] = useState<any>(null);
  const [logsPage, setLogsPage] = useState(1);
  const [affiliatesData, setAffiliatesData] = useState<any[] | null>(null);

  // Reset stats state
  const [resetting, setResetting] = useState(false);

  // Calculate date range based on timeframe
  const getDateRange = (period: Timeframe) => {
    const now = new Date();
    const end = new Date(now); // End is always now/end of today
    end.setHours(23, 59, 59, 999);
    
    let start = new Date(now);
    start.setHours(0, 0, 0, 0); // Default start of today

    switch (period) {
      case 'today':
        // Already set to start of today
        break;
      case 'yesterday':
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
        break;
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
      case 'all':
        start = new Date(2024, 0, 1); // Project start
        break;
    }
    
    return { 
      startDate: start.toISOString(), 
      endDate: end.toISOString() 
    };
  };

  const fetchData = async () => {
    setLoading(true);
    const token = getToken();
    if (!token) return;

    const { startDate, endDate } = getDateRange(timeframe);

    try {
      if (activeTab === 'cost') {
        const res = await api.getAdminFinancials(token, startDate, endDate);
        if (res.success) {
          console.log('Admin Financials:', res.data); // Debug log
          setFinancials(res.data);
        }
      } else if (activeTab === 'users') {
        const res = await api.getAdminUsers(token, usersPage, 50);
        if (res.success) {
          setUsersData(res.data);
        }
      } else if (activeTab === 'logs') {
        const res = await api.getAdminLogs(token, logsPage, 50);
        if (res.success) {
          setLogsData(res.data);
        }
      } else if (activeTab === 'affiliates') {
        const res = await api.getAffiliates(token);
        if (res.success && res.data) {
          setAffiliatesData(res.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeframe, activeTab, logsPage, usersPage]);

  const handleResetStats = async (scope: 'all' | 'today') => {
    const message = scope === 'today' 
      ? '⚠️ This will wipe usage and cost statistics for TODAY only. Are you sure?'
      : '⚠️ DANGER: This will wipe ALL usage and cost statistics from the database. This cannot be undone.\n\nAre you sure you want to reset all stats?';

    if (!confirm(message)) {
      return;
    }

    setResetting(true);
    const token = getToken();
    if (!token) return;

    try {
      const res = await api.resetStats(token, scope);
      if (res.success) {
        alert('Stats reset successfully.');
        fetchData(); // Refresh data
      } else {
        alert('Failed to reset stats: ' + res.error);
      }
    } catch (err) {
      console.error('Reset failed:', err);
      alert('An error occurred while resetting stats.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
      {/* SIDEBAR */}
      <div className="min-w-0">
        <div className="flex flex-col gap-6 sticky top-20 sm:top-24 lg:top-32 max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-6rem)] lg:max-h-[calc(100vh-8rem)] overflow-y-auto pb-4">
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 mb-2 px-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500/20 via-orange-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center border border-orange-500/30">
            <Shield className="w-5 h-5 text-orange-500" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Admin
          </h1>
        </div>

        {/* Sidebar Nav */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('cost')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${ 
              activeTab === 'cost'
                ? 'bg-gradient-to-r from-orange-500/10 to-yellow-500/10 text-orange-500 border border-orange-500/20 shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            Cost Analysis
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${ 
              activeTab === 'users'
                ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-500 border border-purple-500/20 shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            <Users className="w-5 h-5" />
            Users
          </button>

          <button
            onClick={() => setActiveTab('affiliates')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${ 
              activeTab === 'affiliates'
                ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-500 border border-green-500/20 shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            <LinkIcon className="w-5 h-5" />
            Affiliates
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${ 
              activeTab === 'logs'
                ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-500 border border-blue-500/20 shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            <FileText className="w-5 h-5" />
            Logs
          </button>

          <div className="h-px bg-border my-2" />

          <button
            onClick={() => handleResetStats('all')}
            disabled={resetting}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
          >
            <Trash2 className="w-5 h-5" />
            {resetting ? 'Resetting...' : 'Reset Daily Stats'}
          </button>
        </div>
      </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col gap-8 min-w-0">
        
        {/* Content Header (Title + Timeframe) */}
        {activeTab !== 'affiliates' && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-paper p-4 rounded-xl border border-border">
            <div>
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                {activeTab === 'cost' && <DollarSign className="w-5 h-5 text-orange-500" />}
                {activeTab === 'users' && <Users className="w-5 h-5 text-purple-500" />}
                {activeTab === 'logs' && <FileText className="w-5 h-5 text-blue-500" />}
                
                {activeTab === 'cost' && 'Financial Overview'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'logs' && 'System Logs'}
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                {activeTab === 'cost' && 'Track API costs and token consumption'}
                {activeTab === 'users' && 'View all users and their lifetime value'}
                {activeTab === 'logs' && 'Detailed inspection of all system interactions'}
              </p>
            </div>

            {/* Timeframe Selector (Hidden for Logs/Users as they use pagination) */}
            {activeTab === 'cost' && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
                  <Calendar className="w-4 h-4 text-text-secondary hidden md:block" />
                  {(['today', 'yesterday', 'week', 'month', 'year', 'all'] as Timeframe[]).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${ 
                        timeframe === tf
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-surface-hover text-text-secondary hover:bg-surface-highlight'
                      }`}
                    >
                      {tf.charAt(0).toUpperCase() + tf.slice(1)}
                    </button>
                  ))}
                </div>
                
                <div className="h-6 w-px bg-border mx-2 hidden md:block"></div>

                <button 
                  onClick={() => handleResetStats('today')}
                  disabled={resetting}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 border border-red-500/20 transition-colors whitespace-nowrap"
                >
                  <Trash2 className="w-3 h-3" />
                  Reset Today
                </button>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* COST TAB CONTENT */}
          {activeTab === 'cost' && (
            <CostTab data={financials} />
          )}

          {/* USERS TAB CONTENT */}
          {activeTab === 'users' && (
            <UsersTab 
              data={usersData} 
              page={usersPage} 
              setPage={setUsersPage} 
            />
          )}

          {/* AFFILIATES TAB CONTENT */}
          {activeTab === 'affiliates' && (
            <AffiliatesTab 
              data={affiliatesData} 
              onRefresh={fetchData} 
            />
          )}

          {/* LOGS TAB CONTENT */}
          {activeTab === 'logs' && (
            <LogsTab 
              data={logsData} 
              page={logsPage} 
              setPage={setLogsPage} 
            />
          )}
        </div>
      </div>
    </div>
  );
}