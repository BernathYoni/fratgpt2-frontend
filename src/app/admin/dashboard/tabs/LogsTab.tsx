import React, { useState } from 'react';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { ChevronUp, ChevronDown, Shield, MessageSquare, Clock, User, DollarSign, Image as ImageIcon } from 'lucide-react';
import { formatDateTime, formatCurrency } from '../utils';

interface LogsTabProps {
  data: any;
  page: number;
  setPage: (p: number | ((prev: number) => number)) => void;
}

export default function LogsTab({ data, page, setPage }: LogsTabProps) {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  if (!data) return null;

  const toggleLogExpand = (id: string) => {
    if (expandedLogId === id) {
      setExpandedLogId(null);
    } else {
      setExpandedLogId(id);
    }
  };

  // Helper function to get mode badge styles
  const getModeBadgeStyles = (mode: string) => {
    switch (mode) {
      case 'EXPERT':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'FAST':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'REGULAR':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  // Helper function to get provider badge styles
  const getProviderBadgeStyles = (provider: string) => {
    switch (provider) {
      case 'GEMINI':
        return 'bg-blue-500';
      case 'OPENAI':
        return 'bg-green-500';
      case 'CLAUDE':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Helper function to get model name based on provider and mode
  const getModelName = (provider: string, mode: string) => {
    if (provider === 'GEMINI') {
      if (mode === 'FAST') return 'Gemini 2.0 Flash';
      if (mode === 'EXPERT') return 'Gemini 3.0 Pro';
      return 'Gemini 2.5 Pro';
    }
    if (provider === 'OPENAI') {
      if (mode === 'EXPERT') return 'GPT-5.1';
      return 'GPT-5 mini';
    }
    if (provider === 'CLAUDE') {
      if (mode === 'EXPERT') return 'Claude Opus 4.5';
      return 'Claude Sonnet 4.5';
    }
    return provider;
  };

  // Helper function to determine solve method
  const getSolveMethod = (log: any) => {
    if (log.input.images.length > 0) {
      const source = log.input.images[0].source;
      if (source === 'SNIP') return 'Snip';
      if (source === 'SCREEN') return 'Screen';
      return 'Image';
    }
    return 'Highlight';
  };

  return (
    <div className="space-y-4">
      {/* Log Cards */}
      <div className="space-y-4">
        {data.logs.map((log: any) => (
          <Card
            key={log.id}
            className="overflow-hidden"
          >
            {/* Clickable wrapper */}
            <div
              className="cursor-pointer -m-6 p-6"
              onClick={() => toggleLogExpand(log.id)}
            >
              {/* Top Section - Action Type & Metadata */}
              <div className="flex items-center justify-between mb-4">
                {/* Left: Action Type with badges */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                      Solve
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${getModeBadgeStyles(log.mode)}`}>
                      {log.mode}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 shadow-sm">
                      {getSolveMethod(log)}
                    </span>
                  </div>
                </div>

                {/* Right: Expand Icon */}
                <div className="flex items-center gap-3">
                  {expandedLogId === log.id ? (
                    <ChevronUp className="w-6 h-6 text-orange-500" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>

              {/* User & Time Row */}
              <div className="flex items-center gap-6 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">
                    {log.user.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {formatDateTime(log.createdAt)}
                  </span>
                </div>
              </div>

              {/* Input Preview */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
                <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                  {log.input.text}
                </p>
              </div>

              {/* Cost Breakdown Section */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-gray-600">Total Cost</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(log.totalCost)}
                  </span>
                </div>

                {/* Model-by-Model Breakdown */}
                <div className="space-y-2">
                  {log.outputs.map((out: any, i: number) => (
                    <div key={i} className="bg-white/70 backdrop-blur rounded-lg p-3 border border-green-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-gray-800">
                          {getModelName(out.provider, log.mode)}
                        </span>
                        <span className="text-lg font-bold text-green-700">
                          {formatCurrency(out.cost)}
                        </span>
                      </div>
                      {out.metadata?.tokenUsage && (
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-blue-600">{out.metadata.tokenUsage.inputTokens}</span>
                            <span>input</span>
                          </div>
                          <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-purple-600">{out.metadata.tokenUsage.outputTokens}</span>
                            <span>output</span>
                          </div>
                          {out.metadata.tokenUsage.thinkingTokens > 0 && (
                            <>
                              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-orange-600">{out.metadata.tokenUsage.thinkingTokens}</span>
                                <span>thinking</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedLogId === log.id && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input Section */}
                  <div>
                    <h4 className="text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Input & Context
                    </h4>
                    <div className="bg-surface-hover/30 p-4 rounded-lg border border-border space-y-3">
                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 gap-3 pb-3 border-b border-border">
                        <div>
                          <span className="text-xs text-text-secondary block mb-1">IP Address</span>
                          <span className="font-mono text-xs text-text-primary">{log.ipAddress || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-xs text-text-secondary block mb-1">Interactions</span>
                          <span className="font-mono text-xs text-text-primary">{log.interactions?.length || 0} events</span>
                        </div>
                      </div>

                      {/* Source URL */}
                      {log.sourceUrl && (
                        <div className="pb-3 border-b border-border">
                          <span className="text-xs text-text-secondary block mb-1">Source URL</span>
                          <a
                            href={log.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline truncate block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {log.sourceUrl}
                          </a>
                        </div>
                      )}

                      {/* Full Input Text */}
                      <div>
                        <p className="text-sm text-text-primary whitespace-pre-wrap">{log.input.text}</p>
                      </div>

                      {/* Image Attachments */}
                      {log.input.images.length > 0 && (
                        <div className="space-y-2 pt-3 border-t border-border">
                          {log.input.images.map((img: any) => (
                            <div key={img.id} className="flex items-center gap-2 text-xs">
                              <Shield className="w-3 h-3 text-text-secondary flex-shrink-0" />
                              <span className="text-text-secondary">
                                Image: <span className="font-medium">{img.source}</span> ({img.hasImage ? 'Stored' : 'Deleted'})
                              </span>
                              {img.regionData && (
                                <span className="text-green-500 text-xs px-1.5 py-0.5 bg-green-500/10 rounded">
                                  Has Region Data
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Output Section */}
                  <div>
                    <h4 className="text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Outputs & Costs
                    </h4>
                    <div className="space-y-3">
                      {log.outputs.map((out: any, idx: number) => (
                        <div key={idx} className="bg-surface-hover/30 p-4 rounded-lg border border-border space-y-3">
                          {/* Provider Header */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${getProviderBadgeStyles(out.provider)}`}>
                                {out.provider[0]}
                              </div>
                              <span className="text-sm font-bold text-text-primary">
                                {out.provider}
                              </span>
                            </div>
                            <span className="text-sm font-mono font-bold text-text-primary">
                              {formatCurrency(out.cost)}
                            </span>
                          </div>

                          {/* Answer Preview */}
                          <div className="bg-white/50 p-3 rounded border border-border">
                            <p className="text-sm text-text-primary line-clamp-3">
                              {out.shortAnswer}
                            </p>
                          </div>

                          {/* Metadata */}
                          <div className="text-xs font-mono bg-black/5 p-2.5 rounded space-y-1">
                            <div className="flex justify-between">
                              <span className="text-text-secondary">Confidence:</span>
                              <span className="text-text-primary font-semibold">
                                {out.confidence?.toFixed(2) ?? 'N/A'}
                              </span>
                            </div>
                            {out.metadata?.tokenUsage && (
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Tokens:</span>
                                <span className="text-text-primary">
                                  {out.metadata.tokenUsage.inputTokens} in / {out.metadata.tokenUsage.outputTokens} out
                                </span>
                              </div>
                            )}
                            {out.structuredAnswer && (
                              <div className="pt-1 border-t border-border">
                                <span className="text-green-600 font-semibold">Has Structured Answer</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Card className="bg-surface-paper">
        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Showing <span className="font-semibold text-text-primary">{(data.pagination.page - 1) * data.pagination.limit + 1}</span> to <span className="font-semibold text-text-primary">{Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)}</span> of <span className="font-semibold text-text-primary">{data.pagination.total}</span> logs
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={(e) => {
                e.stopPropagation();
                setPage(p => p - 1);
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.pagination.totalPages}
              onClick={(e) => {
                e.stopPropagation();
                setPage(p => p + 1);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
