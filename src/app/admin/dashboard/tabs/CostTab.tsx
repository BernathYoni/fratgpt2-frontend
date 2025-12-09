import React from 'react';
import { Card } from '@/app/components/ui/Card';
import { DollarSign, Activity } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils';

interface CostTabProps {
  data: any;
}

export default function CostTab({ data }: CostTabProps) {
  if (!data) return null;

  return (
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
          <p className="text-3xl font-bold text-text-primary">{formatCurrency(data.totalCost)}</p>
          <p className="text-xs text-text-secondary mt-1">For selected timeframe</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-text-secondary mb-2">Gemini</h3>
          <p className="text-2xl font-bold text-text-primary">{formatCurrency(data.providers.gemini.cost)}</p>
          <div className="w-full h-1.5 bg-surface-dark rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${data.providers.gemini.percentage}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary mt-1">{data.providers.gemini.percentage.toFixed(1)}% of total</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-text-secondary mb-2">OpenAI</h3>
          <p className="text-2xl font-bold text-text-primary">{formatCurrency(data.providers.openai.cost)}</p>
          <div className="w-full h-1.5 bg-surface-dark rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${data.providers.openai.percentage}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary mt-1">{data.providers.openai.percentage.toFixed(1)}% of total</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-text-secondary mb-2">Claude</h3>
          <p className="text-2xl font-bold text-text-primary">{formatCurrency(data.providers.claude.cost)}</p>
          <div className="w-full h-1.5 bg-surface-dark rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${data.providers.claude.percentage}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary mt-1">{data.providers.claude.percentage.toFixed(1)}% of total</p>
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
              {(['gemini', 'openai', 'claude'] as const).map((providerKey) => {
                const providerData = data.providers[providerKey];
                const models = Object.entries(providerData.models) as [string, { inputTokens: number; outputTokens: number; cost: number }][];

                // Calculate totals for provider summary
                const providerInputTokens = Object.values(providerData.models).reduce((sum: number, m: any) => sum + (m.inputTokens || 0), 0);
                const providerOutputTokens = Object.values(providerData.models).reduce((sum: number, m: any) => sum + (m.outputTokens || 0), 0);
                const providerTotalTokens = providerInputTokens + providerOutputTokens;
                const providerCost = providerData.cost;

                if (providerCost === 0 && models.length === 0) return null; // Hide provider if no usage at all

                return (
                  <React.Fragment key={providerKey}>
                    {/* Provider Summary Row */}
                    <tr className="bg-surface-paper hover:bg-surface-hover transition-colors border-b border-border/50">
                      <td className="py-3 px-4 text-sm font-bold text-text-primary">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                            ${providerKey === 'gemini' ? 'bg-blue-500/20 text-blue-500' : ''}
                            ${providerKey === 'openai' ? 'bg-green-500/20 text-green-500' : ''}
                            ${providerKey === 'claude' ? 'bg-orange-500/20 text-orange-500' : ''}
                          `}>
                            {providerKey.charAt(0).toUpperCase()}
                          </div>
                          {providerKey.charAt(0).toUpperCase() + providerKey.slice(1)}
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-sm font-bold text-text-primary">
                        {formatNumber(providerInputTokens)}
                      </td>
                      <td className="text-right py-3 px-4 text-sm font-bold text-text-primary">
                        {formatNumber(providerOutputTokens)}
                      </td>
                      <td className="text-right py-3 px-4 text-sm font-bold text-text-primary">
                        {formatNumber(providerTotalTokens)}
                      </td>
                      <td className="text-right py-3 px-4 text-sm font-bold text-primary">
                        {formatCurrency(providerCost)}
                      </td>
                    </tr>

                    {/* Individual Model Rows */}
                    {models.map(([modelName, stats]: [string, { inputTokens: number; outputTokens: number; cost: number }]) => (
                      <tr key={`${providerKey}-${modelName}`} className="bg-surface-paper/30 hover:bg-surface-hover/50 transition-colors border-b border-border/20">
                        <td className="py-2 pl-12 pr-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-text-secondary/50"></div>
                            <span className="font-medium text-text-secondary">{modelName}</span>
                          </div>
                        </td>
                        <td className="text-right py-2 px-4 text-text-secondary font-mono text-xs">
                          {formatNumber(stats.inputTokens)}
                        </td>
                        <td className="text-right py-2 px-4 text-text-secondary font-mono text-xs">
                          {formatNumber(stats.outputTokens)}
                        </td>
                        <td className="text-right py-2 px-4 text-text-secondary font-mono text-xs">
                          {formatNumber(stats.inputTokens + stats.outputTokens)}
                        </td>
                        <td className="text-right py-2 px-4 text-text-secondary font-mono text-xs">
                          {formatCurrency(stats.cost)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
