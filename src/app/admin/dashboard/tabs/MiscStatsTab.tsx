import React from 'react';
import { Card } from '@/app/components/ui/Card';
import { Scissors, Monitor, BarChart2 } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils';

interface MiscStatsTabProps {
  data: any;
}

export default function MiscStatsTab({ data }: MiscStatsTabProps) {
  if (!data) return null;

  const { snips, screens, totalSolves } = data;
  const snipPercentage = totalSolves > 0 ? (snips.count / totalSolves) * 100 : 0;
  const screenPercentage = totalSolves > 0 ? (screens.count / totalSolves) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Top Section: Snips vs Screens Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Snips Card */}
        <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <Scissors className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Snips</h3>
                        <p className="text-sm text-text-secondary">Selected Regions</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-blue-500">{snipPercentage.toFixed(1)}%</span>
                </div>
            </div>
            
            <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-surface-hover rounded-lg">
                    <span className="text-sm font-medium text-text-secondary">Total Count</span>
                    <span className="text-lg font-bold text-text-primary">{formatNumber(snips.count)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface-hover rounded-lg">
                    <span className="text-sm font-medium text-text-secondary">Avg. Cost</span>
                    <span className="text-lg font-bold text-text-primary">{formatCurrency(snips.avgCost)}</span>
                </div>
            </div>
        </Card>

        {/* Screens Card */}
        <Card className="p-6 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                        <Monitor className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Screens</h3>
                        <p className="text-sm text-text-secondary">Full Captures</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-purple-500">{screenPercentage.toFixed(1)}%</span>
                </div>
            </div>
            
            <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-surface-hover rounded-lg">
                    <span className="text-sm font-medium text-text-secondary">Total Count</span>
                    <span className="text-lg font-bold text-text-primary">{formatNumber(screens.count)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface-hover rounded-lg">
                    <span className="text-sm font-medium text-text-secondary">Avg. Cost</span>
                    <span className="text-lg font-bold text-text-primary">{formatCurrency(screens.avgCost)}</span>
                </div>
            </div>
        </Card>
      </div>

      {/* Breakdown: Snip Cost by Mode */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-primary" />
            Average Cost per Snip (By Mode)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fast Mode */}
            <div className="bg-surface-paper rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-semibold text-text-primary">Fast Mode</span>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                    {formatCurrency(snips.modes.FAST.avgCost)}
                </div>
                <div className="text-xs text-text-secondary">
                    Based on {formatNumber(snips.modes.FAST.count)} solves
                </div>
            </div>

            {/* Regular Mode */}
            <div className="bg-surface-paper rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-semibold text-text-primary">Regular Mode</span>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                    {formatCurrency(snips.modes.REGULAR.avgCost)}
                </div>
                <div className="text-xs text-text-secondary">
                    Based on {formatNumber(snips.modes.REGULAR.count)} solves
                </div>
            </div>

            {/* Expert Mode */}
            <div className="bg-surface-paper rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="font-semibold text-text-primary">Expert Mode</span>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                    {formatCurrency(snips.modes.EXPERT.avgCost)}
                </div>
                <div className="text-xs text-text-secondary">
                    Based on {formatNumber(snips.modes.EXPERT.count)} solves
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
}
