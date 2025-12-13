import React from 'react';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { formatDate, formatCurrency, formatNumber } from '../utils';

interface UsersTabProps {
  data: any;
  page: number;
  setPage: (p: number | ((prev: number) => number)) => void;
}

export default function UsersTab({ data, page, setPage }: UsersTabProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-paper border-b border-border">
                <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">User</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">Role</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">Plan</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">Member Since</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">Location</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-text-secondary">Usage (Month)</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-text-secondary">Usage (Avg)</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-text-secondary">Solves</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-text-secondary">Lifetime Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.users.map((user: any) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-surface-hover/50 transition-colors"
                >
                  <td className="py-4 px-6 text-sm">
                    <div className="font-medium text-text-primary">{user.email}</div>
                    <div className="text-xs text-text-secondary font-mono">{user.id}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${ 
                      user.role === 'ADMIN' 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : 'bg-surface-paper text-text-secondary border border-border'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${ 
                        user.plan === 'PRO' ? 'text-purple-500' :
                        user.plan === 'BASIC' ? 'text-blue-500' :
                        'text-text-secondary'
                      }`}>
                        {user.plan}
                      </span>
                      <span className="text-[10px] text-text-secondary">
                        since {formatDate(user.planSince)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-text-secondary">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {user.location ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-text-primary">{user.location}</span>
                        <span className="text-[10px] text-text-secondary font-mono">{user.lastIp}</span>
                      </div>
                    ) : (
                      <span className="text-text-secondary">-</span>
                    )}
                  </td>
                  <td className="text-right py-4 px-6">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      user.usageThisMonthPercent >= 90 ? 'bg-red-500/10 text-red-500' :
                      user.usageThisMonthPercent >= 50 ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-green-500/10 text-green-500'
                    }`}>
                      {user.usageThisMonthPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right py-4 px-6 text-sm font-mono text-text-secondary">
                    {user.averageMonthlyUsagePercent.toFixed(1)}%
                  </td>
                  <td className="text-right py-4 px-6 text-sm font-mono text-text-primary">
                    {formatNumber(user.lifetimeSolves)}
                  </td>
                  <td className="text-right py-4 px-6 text-sm font-bold text-text-primary">
                    {formatCurrency(user.lifetimeCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-surface-paper">
          <div className="text-sm text-text-secondary">
            Showing {(data.pagination.page - 1) * data.pagination.limit + 1} to {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of {data.pagination.total} users
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
