'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '../components/Navigation';
import { Card } from '../components/ui/Card';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function HistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await api.getSolveHistory(token);
      if (res.success && res.data) {
        setHistory(Array.isArray(res.data) ? res.data : (res.data as any).history || []);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-6xl mx-auto px-6 pt-20 sm:pt-24 lg:pt-32 pb-12">
        <h1 className="text-3xl font-bold mb-8">Solve History</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-text-secondary">Loading...</div>
        </div>
      ) : history.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">No solve history yet</p>
            <p className="text-text-muted text-sm">
              Start using the extension to see your solutions here
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item, idx) => (
            <Card key={idx} hover>
              <div className="flex items-start gap-4">
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt="Problem"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-text-muted">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                      {item.mode}
                    </span>
                  </div>
                  <p className="text-text-primary">{item.answer || 'Answer not available'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
