'use client';

import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { getToken } from '@/lib/auth';
import { Sparkles, Zap, Bot, Brain, TrendingUp } from 'lucide-react';

type TimePeriod = 'today' | 'yesterday' | 'week' | 'month' | '6months' | 'year' | 'all';

interface ModelAnalytics {
  model: string;
  inputTokens: number;
  outputTokens: number;
  thinkingTokens?: number;
  totalCost: number;
  percentage: number;
}

interface AnalyticsData {
  period: TimePeriod;
  totalCost: number;
  models: ModelAnalytics[];
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://api.fratgpt.co'}/admin/stats?period=${selectedPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to load analytics' }));
        throw new Error(errorData.error || 'Failed to load analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('[ADMIN] Failed to load analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: '6months', label: '6 Months' },
    { value: 'year', label: 'Year' },
    { value: 'all', label: 'All Time' },
  ];

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(cost);
  };

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(2)}M`;
    } else if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}K`;
    }
    return tokens.toLocaleString();
  };

  // Map model names to icons and colors
  const modelConfig: Record<string, { icon: any; color: string; bgColor: string }> = {
    'gemini-flash': {
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    'gemini-pro': {
      icon: Sparkles,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    'gpt-4': {
      icon: Bot,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    'claude': {
      icon: Brain,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  };

  const getModelConfig = (modelName: string) => {
    return (
      modelConfig[modelName] || {
        icon: Bot,
        color: 'text-accent',
        bgColor: 'bg-accent/10',
      }
    );
  };

  const formatModelName = (modelName: string) => {
    return modelName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div>
      {/* Time Period Tabs */}
      <Card className="mb-8">
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPeriod === period.value
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-surface-hover text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-text-secondary">Loading analytics...</div>
        </div>
      ) : error ? (
        <Card className="bg-error/10 border-error/30">
          <div className="text-center py-12">
            <p className="text-error mb-2">Error loading analytics</p>
            <p className="text-text-secondary text-sm">{error}</p>
            <button
              onClick={loadAnalytics}
              className="mt-4 px-4 py-2 bg-error/20 hover:bg-error/30 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </Card>
      ) : !analytics ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-text-secondary">No data available for this period</p>
          </div>
        </Card>
      ) : (
        <>
          {/* Total Cost Summary */}
          <Card className="mb-8 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-text-muted text-sm mb-1">
                  Total Cost ({periods.find((p) => p.value === selectedPeriod)?.label})
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  {formatCost(analytics.totalCost)}
                </p>
              </div>
            </div>
          </Card>

          {/* Model Breakdown Table */}
          <Card>
            <h2 className="text-xl font-semibold mb-6">Per-Model Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">Model</th>
                    <th className="text-right py-3 px-4 text-text-secondary font-medium text-sm">Input Tokens</th>
                    <th className="text-right py-3 px-4 text-text-secondary font-medium text-sm">Output Tokens</th>
                    <th className="text-right py-3 px-4 text-text-secondary font-medium text-sm">Thinking Tokens</th>
                    <th className="text-right py-3 px-4 text-text-secondary font-medium text-sm">Total Cost</th>
                    <th className="text-right py-3 px-4 text-text-secondary font-medium text-sm">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.models.map((model) => {
                    const config = getModelConfig(model.model);
                    const Icon = config.icon;

                    return (
                      <tr key={model.model} className="border-b border-border hover:bg-surface-hover transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                              <Icon className={`w-5 h-5 ${config.color}`} />
                            </div>
                            <span className="font-medium">{formatModelName(model.model)}</span>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4 font-mono text-text-secondary">
                          {formatTokens(model.inputTokens)}
                        </td>
                        <td className="text-right py-4 px-4 font-mono text-text-secondary">
                          {formatTokens(model.outputTokens)}
                        </td>
                        <td className="text-right py-4 px-4 font-mono text-text-secondary">
                          {model.thinkingTokens !== undefined && model.thinkingTokens > 0
                            ? formatTokens(model.thinkingTokens)
                            : '-'}
                        </td>
                        <td className="text-right py-4 px-4">
                          <span className={`font-bold ${config.color}`}>{formatCost(model.totalCost)}</span>
                        </td>
                        <td className="text-right py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <div className="flex-1 max-w-[100px] h-2 bg-surface-hover rounded-full overflow-hidden">
                              <div
                                className={`h-full ${config.bgColor} transition-all`}
                                style={{ width: `${model.percentage}%` }}
                              />
                            </div>
                            <span className="text-text-secondary text-sm font-medium min-w-[40px]">
                              {Math.round(model.percentage)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border">
                    <td className="py-4 px-4 font-bold">Total</td>
                    <td className="text-right py-4 px-4 font-mono font-bold text-text-primary">
                      {formatTokens(analytics.models.reduce((sum, m) => sum + m.inputTokens, 0))}
                    </td>
                    <td className="text-right py-4 px-4 font-mono font-bold text-text-primary">
                      {formatTokens(analytics.models.reduce((sum, m) => sum + m.outputTokens, 0))}
                    </td>
                    <td className="text-right py-4 px-4 font-mono font-bold text-text-primary">
                      {formatTokens(
                        analytics.models.reduce((sum, m) => sum + (m.thinkingTokens || 0), 0)
                      )}
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className="font-bold text-xl bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                        {formatCost(analytics.totalCost)}
                      </span>
                    </td>
                    <td className="text-right py-4 px-4 font-bold text-text-primary">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          {/* Visual Cost Distribution */}
          <Card className="mt-8">
            <h2 className="text-xl font-semibold mb-6">Cost Distribution</h2>
            <div className="space-y-4">
              {analytics.models.map((model) => {
                const config = getModelConfig(model.model);
                const Icon = config.icon;

                return (
                  <div key={model.model}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${config.color}`} />
                        <span className="font-medium">{formatModelName(model.model)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${config.color}`}>{formatCost(model.totalCost)}</span>
                        <span className="text-text-muted text-sm min-w-[50px] text-right">
                          {Math.round(model.percentage)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-4 bg-surface-hover rounded-full overflow-hidden">
                      <div
                        className={`h-full ${config.bgColor} border-2 ${config.color.replace('text-', 'border-')} transition-all duration-500`}
                        style={{ width: `${model.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
