import React, { useState } from 'react';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Users, Activity, DollarSign, Plus, X, Edit, Archive, RefreshCw, Trash2, Link as LinkIcon } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

interface AffiliatesTabProps {
  data: any[] | null;
  onRefresh: () => void;
}

export default function AffiliatesTab({ data, onRefresh }: AffiliatesTabProps) {
  const [showAffiliateForm, setShowAffiliateForm] = useState(false);
  const [newAffiliateName, setNewAffiliateName] = useState('');
  const [newAffiliateCode, setNewAffiliateCode] = useState('');
  const [newAffiliatePayoutRate, setNewAffiliatePayoutRate] = useState('5.00');
  const [newPaymentManager, setNewPaymentManager] = useState('Yoni');
  const [createAffiliateLoading, setCreateAffiliateLoading] = useState(false);
  const [showArchivedAffiliates, setShowArchivedAffiliates] = useState(false);

  const handleCreateAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateAffiliateLoading(true);
    const token = getToken();
    if (!token) return;

    try {
      const res = await api.createAffiliate(
        token, 
        newAffiliateName, 
        newAffiliateCode || undefined, 
        parseFloat(newAffiliatePayoutRate),
        newPaymentManager
      );
      if (res.success) {
        alert('Affiliate created successfully!');
        setShowAffiliateForm(false);
        setNewAffiliateName('');
        setNewAffiliateCode('');
        setNewAffiliatePayoutRate('5.00');
        onRefresh();
      } else {
        alert('Failed to create affiliate: ' + res.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error creating affiliate');
    } finally {
      setCreateAffiliateLoading(false);
    }
  };

  const handleArchive = async (id: string, currentStatus: boolean) => {
    if (!confirm(currentStatus ? 'Unarchive this affiliate?' : 'Archive this affiliate? They will be hidden from the main list.')) return;
    const token = getToken();
    if (!token) return;
    try {
      const res = await api.archiveAffiliate(token, id);
      if (res.success) onRefresh();
      else alert('Failed to archive: ' + res.error);
    } catch (err) { alert('Error archiving affiliate'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to DELETE this affiliate? This cannot be undone.')) return;
    const token = getToken();
    if (!token) return;
    try {
      const res = await api.deleteAffiliate(token, id);
      if (res.success) onRefresh();
      else alert('Failed to delete: ' + res.error);
    } catch (err) { alert('Error deleting affiliate'); }
  };

  const handleMarkPaid = async (affiliateId: string, amount: number) => {
    if (!confirm(`Confirm payout of $${amount.toFixed(2)}? This will reset their unpaid balance to $0.`)) return;
    
    const token = getToken();
    if (!token) return;

    try {
      const res = await api.markAffiliatePaid(token, affiliateId);
      if (res.success) {
        onRefresh();
      } else {
        alert('Failed to mark paid: ' + res.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Affiliate Stats Header (Compact) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-green-500/30 bg-gradient-to-br from-surface-paper to-green-500/5 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">Total Affiliates</h3>
            <p className="text-2xl font-bold text-text-primary mt-1">{data?.length || 0}</p>
          </div>
          <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
            <Users className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border-green-500/30 bg-gradient-to-br from-surface-paper to-green-500/5 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">Total Signups</h3>
            <p className="text-2xl font-bold text-text-primary mt-1">
              {data?.reduce((sum, aff) => sum + (aff.signups || 0), 0) || 0}
            </p>
          </div>
          <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
            <Activity className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border-green-500/30 bg-gradient-to-br from-surface-paper to-green-500/5 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">Unpaid Balance</h3>
            <p className="text-2xl font-bold text-text-primary mt-1">
              {formatCurrency(data?.reduce((sum, aff) => sum + (aff.unpaidBalance > 0 ? aff.unpaidBalance : 0), 0) || 0)}
            </p>
          </div>
          <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
            <DollarSign className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-text-primary">
            {showArchivedAffiliates ? 'Archived Affiliates' : 'Active Affiliates'}
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowArchivedAffiliates(!showArchivedAffiliates)}
            className="ml-2 text-xs h-8"
          >
            {showArchivedAffiliates ? 'Show Active' : 'Show Archived'}
          </Button>
        </div>
        <Button 
          onClick={() => setShowAffiliateForm(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Affiliate
        </Button>
      </div>

      {/* Add Affiliate Modal/Form */}
      {showAffiliateForm && (
        <Card className="p-6 border-green-500/30 bg-surface-paper/50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-text-primary">Create New Affiliate</h3>
            <button 
              onClick={() => setShowAffiliateForm(false)}
              className="text-text-secondary hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleCreateAffiliate} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-text-secondary mb-1 block">Partner Name</label>
                <Input 
                  placeholder="e.g. Mike Smith" 
                  value={newAffiliateName}
                  onChange={(e) => setNewAffiliateName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary mb-1 block">Payment Manager</label>
                <select 
                  className="w-full p-2 rounded-lg bg-background border border-input border-border focus:border-primary outline-none text-text-primary"
                  value={newPaymentManager}
                  onChange={(e) => setNewPaymentManager(e.target.value)}
                >
                  <option value="Yoni">Yoni Bernath</option>
                  <option value="Ethan">Ethan Levine</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Payout Rate ($)</label>
              <Input 
                type="number"
                step="0.01"
                placeholder="5.00" 
                value={newAffiliatePayoutRate}
                onChange={(e) => setNewAffiliatePayoutRate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">
                Custom Code (Optional)
                <span className="ml-2 text-xs text-text-secondary opacity-70">Leave blank to auto-generate</span>
              </label>
              <Input 
                placeholder="e.g. MIKEFREE" 
                value={newAffiliateCode}
                onChange={(e) => setNewAffiliateCode(e.target.value.toUpperCase())}
                pattern="[A-Z0-9_-]+"
                title="Uppercase letters, numbers, underscores, and dashes only"
              />
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAffiliateForm(false)}
                disabled={createAffiliateLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={createAffiliateLoading}
              >
                {createAffiliateLoading ? 'Creating...' : 'Create Affiliate'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Affiliates Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-paper border-b border-border">
                <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">Partner</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">Manager</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-text-secondary">Signups</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-text-secondary">Unpaid Signups</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-text-secondary">Rate</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-text-secondary">Unpaid Balance</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(() => {
                const filteredAffiliates = data?.filter(aff => 
                  showArchivedAffiliates ? aff.archived : !aff.archived
                ) || [];

                if (filteredAffiliates.length === 0) {
                  return (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-text-secondary">
                        {showArchivedAffiliates ? 'No archived affiliates found.' : 'No active affiliates found. Create one to get started.'}
                      </td>
                    </tr>
                  );
                }

                return filteredAffiliates.map((aff) => (
                  <tr key={aff.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-text-primary">{aff.name}</div>
                      <div className="text-xs text-text-secondary">Created {formatDate(aff.createdAt)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm bg-blue-500/10 text-blue-500 px-2 py-1 rounded border border-blue-500/20">
                        {aff.paymentManager || 'Unassigned'}
                      </span>
                    </td>
                    <td className="text-right py-4 px-6">
                      <div className="font-bold text-text-primary">{aff.signups}</div>
                    </td>
                    <td className="text-right py-4 px-6">
                      <div className={`font-bold ${aff.unpaidSignups > 0 ? 'text-orange-500' : 'text-text-secondary'}`}>
                        {aff.unpaidSignups}
                      </div>
                    </td>
                    <td className="text-right py-4 px-6 text-sm text-text-secondary">
                      {formatCurrency(aff.payoutRate)}
                    </td>
                    <td className="text-right py-4 px-6">
                      <span className={`font-bold ${aff.unpaidBalance > 0 ? 'text-green-500' : 'text-text-secondary'}`}>
                        {formatCurrency(aff.unpaidBalance)}
                      </span>
                    </td>
                    <td className="text-right py-4 px-6">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(aff.referralLink);
                            alert('Link copied!');
                          }}
                          className="p-1.5 rounded-lg text-text-secondary hover:text-primary border border-transparent hover:bg-surface-hover transition-colors"
                          title="Copy Link"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={aff.unpaidBalance <= 0}
                          onClick={() => handleMarkPaid(aff.id, aff.unpaidBalance)}
                          className={aff.unpaidBalance > 0 ? 'border-green-500/50 text-green-500 hover:bg-green-500/10' : ''}
                          title="Mark as Paid"
                        >
                          Mark Paid
                        </Button>
                        
                        <button 
                          onClick={() => alert('Edit functionality coming soon')}
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-colors"
                          title="Edit Affiliate"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => handleArchive(aff.id, aff.archived)}
                          className={`p-1.5 rounded-lg border border-transparent transition-colors ${
                            showArchivedAffiliates 
                              ? 'text-green-500 hover:bg-green-500/10 hover:border-green-500/20' 
                              : 'text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/20'
                          }`}
                          title={showArchivedAffiliates ? 'Unarchive Affiliate' : 'Archive Affiliate'}
                        >
                          {showArchivedAffiliates ? <RefreshCw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                        </button>

                        <button 
                          onClick={() => handleDelete(aff.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
                          title="Delete Affiliate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
