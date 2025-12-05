'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Search, DollarSign, Activity, Users, BarChart2, Calendar, Shield, LayoutDashboard, Trash2 } from 'lucide-react';

type Timeframe = 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'all';
type Tab = 'cost' | 'usage';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('cost');
  const [timeframe, setTimeframe] = useState<Timeframe>('today');
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [financials, setFinancials] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  
  // User search states
  const [searchEmail, setSearchEmail] = useState('');
  const [userResult, setUserResult] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

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
          setFinancials(res.data);
        }
      } else {
        // Fetch metrics
        const metricsRes = await api.getAdminMetrics(token, startDate, endDate);
        if (metricsRes.success) {
          setMetrics(metricsRes.data);
        }
        
        // If there's a user search active, re-fetch it for new timeframe
        if (userResult && searchEmail) {
          handleUserSearch(searchEmail);
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
  }, [timeframe, activeTab]);

  const handleUserSearch = async (email: string = searchEmail) => {
    if (!email) return;
    
    setSearchLoading(true);
    setSearchError('');
    const token = getToken();
    const { startDate, endDate } = getDateRange(timeframe);

    try {
      const res = await api.searchUserUsage(token || '', email, startDate, endDate);
      if (res.success) {
        setUserResult(res.data);
      } else {
        setUserResult(null);
        setSearchError(res.error || 'User not found');
      }
    } catch (err) {
      setUserResult(null);
      setSearchError('Failed to search user');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleResetStats = async () => {
    if (!confirm('⚠️ DANGER: This will wipe ALL usage and cost statistics from the database. This cannot be undone.\n\nAre you sure you want to reset all stats?')) {
      return;
    }

    setResetting(true);
    const token = getToken();
    if (!token) return;

    try {
      const res = await api.resetStats(token);
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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(val || 0);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val || 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
      {/* SIDEBAR */}
      <div className="flex flex-col gap-6">
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
            onClick={() => setActiveTab('usage')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'usage'
                ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-500 border border-purple-500/20 shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            <Users className="w-5 h-5" />
            Usage & Users
          </button>

          <div className="h-px bg-border my-2" />

          <button
            onClick={handleResetStats}
            disabled={resetting}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
          >
            <Trash2 className="w-5 h-5" />
            {resetting ? 'Resetting...' : 'Reset Daily Stats'}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col gap-8">
        
        {/* Content Header (Title + Timeframe) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-paper p-4 rounded-xl border border-border">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              {activeTab === 'cost' ? <DollarSign className="w-5 h-5 text-orange-500" /> : <Users className="w-5 h-5 text-purple-500" />}
              {activeTab === 'cost' ? 'Financial Overview' : 'Usage Metrics'}
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              {activeTab === 'cost' ? 'Track API costs and token consumption' : 'Monitor system solves and user activity'}
            </p>
          </div>

          {/* Timeframe Selector */}
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
        </div>

        {/* Dynamic Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* COST TAB CONTENT */}
          {activeTab === 'cost' && financials && (
            <div className="space-y-8">
              {/* Top Level Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6 border-primary/30 bg-gradient-to-br from-surface-paper to-primary/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-medium text-text-secondary">Total Cost</h3>
                  </div>
                  <p className="text-3xl font-bold text-text-primary">{formatCurrency(financials.totalCost)}</p>
                  <p className="text-xs text-text-secondary mt-1">For selected timeframe</p>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-medium text-text-secondary mb-2">Gemini</h3>
                  <p className="text-2xl font-bold text-text-primary">{formatCurrency(financials.providers.gemini.cost)}</p>
                  <div className="w-full h-1.5 bg-surface-dark rounded-full mt-3 overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${financials.providers.gemini.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{financials.providers.gemini.percentage.toFixed(1)}% of total</p>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-medium text-text-secondary mb-2">OpenAI</h3>
                  <p className="text-2xl font-bold text-text-primary">{formatCurrency(financials.providers.openai.cost)}</p>
                  <div className="w-full h-1.5 bg-surface-dark rounded-full mt-3 overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${financials.providers.openai.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{financials.providers.openai.percentage.toFixed(1)}% of total</p>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-medium text-text-secondary mb-2">Claude</h3>
                  <p className="text-2xl font-bold text-text-primary">{formatCurrency(financials.providers.claude.cost)}</p>
                  <div className="w-full h-1.5 bg-surface-dark rounded-full mt-3 overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full" 
                      style={{ width: `${financials.providers.claude.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{financials.providers.claude.percentage.toFixed(1)}% of total</p>
                </Card>
              </div>

              {/* Detailed Token Breakdown */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Token Consumption
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Provider</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">Input Tokens</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">Output Tokens</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">Total Tokens</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">Est. Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {/* Gemini Row */}
                      <tr className="hover:bg-surface-hover/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs font-bold">G</div>
                            <div>
                              <p className="font-medium text-text-primary">Gemini</p>
                              <p className="text-xs text-text-secondary">Flash + Pro</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4 text-text-secondary font-mono text-sm">
                          {formatNumber(financials.providers.gemini.inputTokens)}
                        </td>
                        <td className="text-right py-4 px-4 text-text-secondary font-mono text-sm">
                          {formatNumber(financials.providers.gemini.outputTokens)}
                        </td>
                        <td className="text-right py-4 px-4 text-text-primary font-mono text-sm">
                          {formatNumber(financials.providers.gemini.inputTokens + financials.providers.gemini.outputTokens)}
                        </td>
                        <td className="text-right py-4 px-4 font-bold text-text-primary">
                          {formatCurrency(financials.providers.gemini.cost)}
                        </td>
                      </tr>

                      {/* OpenAI Row */}
                      <tr className="hover:bg-surface-hover/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-xs font-bold">O</div>
                            <div>
                              <p className="font-medium text-text-primary">OpenAI</p>
                              <p className="text-xs text-text-secondary">GPT-5 Models</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4 text-text-secondary font-mono text-sm">
                          {formatNumber(financials.providers.openai.inputTokens)}
                        </td>
                        <td className="text-right py-4 px-4 text-text-secondary font-mono text-sm">
                          {formatNumber(financials.providers.openai.outputTokens)}
                        </td>
                        <td className="text-right py-4 px-4 text-text-primary font-mono text-sm">
                          {formatNumber(financials.providers.openai.inputTokens + financials.providers.openai.outputTokens)}
                        </td>
                        <td className="text-right py-4 px-4 font-bold text-text-primary">
                          {formatCurrency(financials.providers.openai.cost)}
                        </td>
                      </tr>

                      {/* Claude Row */}
                      <tr className="hover:bg-surface-hover/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 text-xs font-bold">C</div>
                            <div>
                              <p className="font-medium text-text-primary">Claude</p>
                              <p className="text-xs text-text-secondary">Sonnet 3.5/4.5</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4 text-text-secondary font-mono text-sm">
                          {formatNumber(financials.providers.claude.inputTokens)}
                        </td>
                        <td className="text-right py-4 px-4 text-text-secondary font-mono text-sm">
                          {formatNumber(financials.providers.claude.outputTokens)}
                        </td>
                        <td className="text-right py-4 px-4 text-text-primary font-mono text-sm">
                          {formatNumber(financials.providers.claude.inputTokens + financials.providers.claude.outputTokens)}
                        </td>
                        <td className="text-right py-4 px-4 font-bold text-text-primary">
                          {formatCurrency(financials.providers.claude.cost)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* USAGE TAB CONTENT */}
          {activeTab === 'usage' && (
            <div className="space-y-8">
              {/* Metrics Cards */}
              {metrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-8 flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
                    <div>
                      <p className="text-text-secondary font-medium mb-1">Total Solves</p>
                      <h2 className="text-4xl font-bold text-text-primary">{formatNumber(metrics.totalSolves)}</h2>
                      <p className="text-sm text-text-secondary mt-2">
                        Total homework problems solved
                      </p>
                    </div>
                    <div className="p-4 bg-surface-paper rounded-full shadow-sm">
                      <BarChart2 className="w-8 h-8 text-purple-500" />
                    </div>
                  </Card>

                  <Card className="p-8 flex items-center justify-between bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-pink-500/20">
                    <div>
                      <p className="text-text-secondary font-medium mb-1">Total Snips</p>
                      <h2 className="text-4xl font-bold text-text-primary">{formatNumber(metrics.totalSnips)}</h2>
                      <p className="text-sm text-text-secondary mt-2">
                        Screen captures processed
                      </p>
                    </div>
                    <div className="p-4 bg-surface-paper rounded-full shadow-sm">
                      <Users className="w-8 h-8 text-pink-500" />
                    </div>
                  </Card>
                </div>
              )}

              {/* User Search */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  User Cost Lookup
                </h3>

                <div className="flex gap-4 mb-8">
                  <div className="flex-1">
                    <Input 
                      placeholder="Enter user email address..." 
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()}
                    />
                  </div>
                  <Button 
                    onClick={() => handleUserSearch()}
                    disabled={searchLoading || !searchEmail}
                  >
                    {searchLoading ? 'Searching...' : 'Search'}
                  </Button>
                </div>

                {searchError && (
                  <div className="p-4 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 mb-4">
                    {searchError}
                  </div>
                )}

                {userResult && (
                  <div className="bg-surface-hover/30 rounded-xl p-6 border border-border animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-border">
                      <div>
                        <h4 className="text-xl font-bold text-text-primary">{userResult.user.email}</h4>
                                            <p className="text-text-secondary text-sm">User ID: {userResult.user.id}</p>
                                            
                                            {/* Subscription History Badge */}
                                            <div className="mt-4 flex flex-wrap gap-2">
                                              {userResult.user.subscriptionHistory?.map((sub: any, idx: number) => (
                                                <div key={idx} className={`px-3 py-1.5 rounded-lg text-xs border ${
                                                  sub.status === 'ACTIVE' 
                                                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                                    : 'bg-surface-paper text-text-secondary border-border'
                                                }`}>
                                                  <span className="font-bold">{sub.plan}</span>
                                                  <span className="mx-1">•</span>
                                                  <span>{sub.durationMonths} mo</span>
                                                  {sub.status === 'ACTIVE' && <span className="ml-1 text-[10px] uppercase bg-green-500 text-white px-1 rounded">Current</span>}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                          <div className="text-right mt-4 md:mt-0">                        <p className="text-sm text-text-secondary">Total User Cost</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(userResult.totalCost)}</p>
                      </div>
                    </div>

                    <h5 className="text-sm font-medium text-text-secondary mb-4 uppercase tracking-wider">Cost Breakdown</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* User - Gemini */}
                      <div className="p-4 bg-surface-paper rounded-lg border border-border relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000" style={{ width: `${userResult.providers.gemini.percentage}%` }} />
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-text-primary">Gemini</span>
                          <span className="text-xs font-bold bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">
                            {userResult.providers.gemini.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-xl font-bold text-text-primary">{formatCurrency(userResult.providers.gemini.cost)}</p>
                      </div>

                      {/* User - OpenAI */}
                      <div className="p-4 bg-surface-paper rounded-lg border border-border relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-1000" style={{ width: `${userResult.providers.openai.percentage}%` }} />
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-text-primary">OpenAI</span>
                          <span className="text-xs font-bold bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                            {userResult.providers.openai.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-xl font-bold text-text-primary">{formatCurrency(userResult.providers.openai.cost)}</p>
                      </div>

                      {/* User - Claude */}
                      <div className="p-4 bg-surface-paper rounded-lg border border-border relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-1000" style={{ width: `${userResult.providers.claude.percentage}%` }} />
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-text-primary">Claude</span>
                          <span className="text-xs font-bold bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full">
                            {userResult.providers.claude.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-xl font-bold text-text-primary">{formatCurrency(userResult.providers.claude.cost)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}