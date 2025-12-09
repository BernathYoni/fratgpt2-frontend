import React, { useState } from 'react';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { ChevronUp, ChevronDown, Shield } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-paper border-b border-border">
                <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">Time</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">User</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">Mode</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">Input</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">Providers</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-text-secondary">Cost</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.logs.map((log: any) => (
                <React.Fragment key={log.id}>
                  <tr 
                    onClick={() => toggleLogExpand(log.id)}
                    className="hover:bg-surface-hover/50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6 text-sm text-text-secondary whitespace-nowrap">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-sm text-text-primary font-medium">
                      {log.user.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${ 
                        log.mode === 'EXPERT' 
                          ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                          : log.mode === 'FAST'
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                            : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {log.mode}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-text-secondary max-w-[200px] truncate">
                      {log.input.text}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex -space-x-2">
                        {log.outputs.map((out: any, i: number) => (
                          <div 
                            key={i} 
                            className={`w-6 h-6 rounded-full flex items-center justify-center border border-surface text-[10px] font-bold text-white
                              ${out.provider === 'GEMINI' ? 'bg-blue-500' : ''}
                              ${out.provider === 'OPENAI' ? 'bg-green-500' : ''}
                              ${out.provider === 'CLAUDE' ? 'bg-orange-500' : ''}
                            `}
                            title={out.provider}
                          >
                            {out.provider[0]}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="text-right py-4 px-6 text-sm font-bold text-text-primary">
                      {formatCurrency(log.totalCost)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {expandedLogId === log.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </td>
                  </tr>
                  
                  {/* Expanded Details */}
                  {expandedLogId === log.id && (
                    <tr className="bg-surface-hover/20">
                      <td colSpan={7} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Input Section */}
                          <div>
                            <h4 className="text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Input & Context</h4>
                            <div className="bg-surface p-4 rounded-lg border border-border">
                              <div className="mb-4 pb-4 border-b border-border">
                                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                   <div>
                                     <span className="text-text-secondary block">IP Address</span>
                                     <span className="font-mono text-text-primary">{log.ipAddress || 'N/A'}</span>
                                   </div>
                                   <div>
                                     <span className="text-text-secondary block">Interactions</span>
                                     <span className="font-mono text-text-primary">{log.interactions?.length || 0} events</span>
                                   </div>
                                </div>
                                {log.sourceUrl && (
                                  <div className="text-xs">
                                    <span className="text-text-secondary block">Source URL</span>
                                    <a href={log.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate block">
                                      {log.sourceUrl}
                                    </a>
                                  </div>
                                )}
                              </div>
                              <p className="text-text-primary whitespace-pre-wrap text-sm">{log.input.text}</p>
                              {log.input.images.map((img: any) => (
                                <div key={img.id} className="mt-2 text-xs text-text-secondary flex items-center gap-2">
                                  <Shield className="w-3 h-3" />
                                  Image: {img.source} ({img.hasImage ? 'Stored' : 'Deleted'})
                                  {img.regionData && <span className="text-green-500 ml-2">Has Region Data</span>}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Output Section */}
                          <div>
                            <h4 className="text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Outputs & Costs</h4>
                            <div className="space-y-4">
                              {log.outputs.map((out: any, idx: number) => (
                                <div key={idx} className="bg-surface p-4 rounded-lg border border-border">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${ 
                                      out.provider === 'GEMINI' ? 'bg-blue-500/10 text-blue-500' :
                                      out.provider === 'OPENAI' ? 'bg-green-500/10 text-green-500' :
                                      'bg-orange-500/10 text-orange-500'
                                    }`}>
                                      {out.provider}
                                    </span>
                                    <span className="text-xs font-mono text-text-secondary">
                                      {formatCurrency(out.cost)}
                                    </span>
                                  </div>
                                  <p className="text-text-primary text-sm line-clamp-3 mb-2">{out.shortAnswer}</p>
                                  
                                  {/* Metadata details */}
                                  <div className="text-[10px] text-text-secondary font-mono bg-black/20 p-2 rounded">
                                    <p>Confidence: {out.confidence?.toFixed(2) ?? 'N/A'}</p>
                                    {out.metadata?.tokenUsage && (
                                      <p>Tokens: {out.metadata.tokenUsage.inputTokens} in / {out.metadata.tokenUsage.outputTokens} out</p>
                                    )}
                                    {out.structuredAnswer && (
                                      <p className="text-green-500 mt-1">Has Structured Answer</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-surface-paper">
          <div className="text-sm text-text-secondary">
            Showing {(data.pagination.page - 1) * data.pagination.limit + 1} to {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of {data.pagination.total} logs
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={page >= data.pagination.totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
