'use client';

import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Sparkles, Zap, Bot, Brain, DollarSign } from 'lucide-react';

interface ModelStats {
  model: string;
  inputTokens: number;
  outputTokens: number;
  thinkingTokens?: number;
  cost: number;
  percentage: number;
}

interface DashboardStats {
  totalCost: number;
  models: ModelStats[];
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const token = getToken();
    console.log('[ADMIN-DASHBOARD] Starting loadStats...');
    console.log('[ADMIN-DASHBOARD] Token exists:', !!token);

    if (!token) {
      console.log('[ADMIN-DASHBOARD] No token, returning early');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.fratgpt.co';
      const fullUrl = `${apiUrl}/admin/stats`;
      console.log('[ADMIN-DASHBOARD] Fetching from:', fullUrl);

      // Call the admin stats API endpoint
      const response = await fetch(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('[ADMIN-DASHBOARD] Response status:', response.status);
      console.log('[ADMIN-DASHBOARD] Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to load stats' }));
        console.log('[ADMIN-DASHBOARD] Error response data:', errorData);
        throw new Error(errorData.error || 'Failed to load stats');
      }

      const data = await response.json();
      console.log('[ADMIN-DASHBOARD] Response data:', JSON.stringify(data, null, 2));
      console.log('[ADMIN-DASHBOARD] Data type:', typeof data);
      console.log('[ADMIN-DASHBOARD] Data keys:', Object.keys(data));
      console.log('[ADMIN-DASHBOARD] Has totalCost:', 'totalCost' in data);
      console.log('[ADMIN-DASHBOARD] Has models:', 'models' in data);
      console.log('[ADMIN-DASHBOARD] Models is array:', Array.isArray(data.models));

      if (data.models) {
        console.log('[ADMIN-DASHBOARD] Models length:', data.models.length);
        console.log('[ADMIN-DASHBOARD] First model:', data.models[0]);
      }

      setStats(data);
      console.log('[ADMIN-DASHBOARD] Stats set successfully');
    } catch (err) {
      console.error('[ADMIN-DASHBOARD] Failed to load stats:', err);
      console.error('[ADMIN-DASHBOARD] Error stack:', err instanceof Error ? err.stack : 'No stack');
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
      console.log('[ADMIN-DASHBOARD] Loading complete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-error/10 border-error/30">
        <div className="text-center py-12">
          <p className="text-error mb-2">Error loading stats</p>
          <p className="text-text-secondary text-sm">{error}</p>
          <button
            onClick={loadStats}
            className="mt-4 px-4 py-2 bg-error/20 hover:bg-error/30 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-text-secondary">No data available</p>
        </div>
      </Card>
    );
  }

  // Map model names to icons and colors
  const modelConfig: Record<string, { icon: any; color: string; gradient: string }> = {
    'gemini-flash': {
      icon: Zap,
      color: 'text-yellow-500',
      gradient: 'from-yellow-500/20 to-orange-500/20',
    },
    'gemini-pro': {
      icon: Sparkles,
      color: 'text-blue-500',
      gradient: 'from-blue-500/20 to-purple-500/20',
    },
    'gpt-4': {
      icon: Bot,
      color: 'text-green-500',
      gradient: 'from-green-500/20 to-emerald-500/20',
    },
    'claude': {
      icon: Brain,
      color: 'text-purple-500',
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
  };

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

  console.log('[ADMIN-DASHBOARD] Rendering with stats:', stats);

  return (
    <div>
      {/* Total Cost Card */}
      <Card className="mb-8 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <DollarSign className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-text-secondary text-sm mb-1">Total Site-Wide Cost</p>
            <p className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              {formatCost(stats.totalCost)}
            </p>
            <p className="text-text-muted text-sm mt-1">Cumulative across all models</p>
          </div>
        </div>
      </Card>

      {/* Model Stats Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {stats.models.map((model) => {
          console.log('[ADMIN-DASHBOARD] Rendering model:', model);
          const config = modelConfig[model.model] || {
            icon: Bot,
            color: 'text-accent',
            gradient: 'from-accent/20 to-accent/10',
          };
          const Icon = config.icon;

          return (
            <ModelStatCard
              key={model.model}
              icon={<Icon className="w-6 h-6" />}
              modelName={model.model}
              inputTokens={model.inputTokens}
              outputTokens={model.outputTokens}
              thinkingTokens={model.thinkingTokens}
              cost={model.cost}
              percentage={model.percentage}
              color={config.color}
              gradient={config.gradient}
              formatCost={formatCost}
              formatTokens={formatTokens}
            />
          );
        })}
      </div>
    </div>
  );
}

function ModelStatCard({
  icon,
  modelName,
  inputTokens,
  outputTokens,
  thinkingTokens,
  cost,
  percentage,
  color,
  gradient,
  formatCost,
  formatTokens,
}: {
  icon: React.ReactNode;
  modelName: string;
  inputTokens: number;
  outputTokens: number;
  thinkingTokens?: number;
  cost: number;
  percentage: number;
  color: string;
  gradient: string;
  formatCost: (cost: number) => string;
  formatTokens: (tokens: number) => string;
}) {
  // Format model name for display
  const displayName = modelName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Card>
      <div className="flex items-start gap-6">
        {/* Left side - Visual representation */}
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24">
            {/* Background circle */}
            <svg className="transform -rotate-90 w-24 h-24">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-surface-hover"
              />
              {/* Progress circle */}
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                className={`${color} transition-all duration-500`}
                strokeLinecap="round"
              />
            </svg>
            {/* Percentage text in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${color}`}>{Math.round(percentage)}%</span>
            </div>
          </div>
        </div>

        {/* Right side - Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <div className={`${color}`}>{icon}</div>
            <h3 className="text-lg font-semibold">{displayName}</h3>
          </div>

          {/* Token counts */}
          <div className="space-y-1 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Input:</span>
              <span className="text-text-secondary font-mono">{formatTokens(inputTokens)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Output:</span>
              <span className="text-text-secondary font-mono">{formatTokens(outputTokens)}</span>
            </div>
            {thinkingTokens !== undefined && thinkingTokens > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Thinking:</span>
                <span className="text-text-secondary font-mono">{formatTokens(thinkingTokens)}</span>
              </div>
            )}
          </div>

          {/* Cost */}
          <div className={`bg-gradient-to-r ${gradient} border border-current/20 rounded-lg px-3 py-2`}>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-text-muted">Cost:</span>
              <span className={`text-xl font-bold ${color}`}>{formatCost(cost)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
