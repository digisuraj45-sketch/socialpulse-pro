import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Wallet,
  CheckCircle2,
  XCircle,
  Search,
  Check,
  AlertTriangle,
  QrCode,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const AdminDepositsView: React.FC = () => {
  const { deposits, adminApproveDeposit, adminRejectDeposit, formatCurrency } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const filteredDeposits = deposits.filter(d => {
    const userName = d.user_name || '';
    const userEmail = d.user_email || '';
    const transRef = d.transaction_ref || '';

    const matchesSearch =
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transRef.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-purple-900/30">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">Reconciliation Queue</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Deposit Approvals & UPI Verification</h1>
          <p className="text-xs text-slate-400 mt-1">Audit manual UTR references, verify bank credit, and trigger atomic wallet allocations.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client, email, or UTR..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['pending', 'approved', 'rejected', 'all'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                filterStatus === st
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st} {st === 'pending' && `(${deposits.filter(d => d.status === 'pending').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Deposits Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">ID</th>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Method</th>
                <th className="px-4 py-3.5">UTR / Reference</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-center">Submitted</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No deposit records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-slate-850/50 transition">
                    <td className="px-4 py-4 font-mono font-bold text-slate-400">
                      #{dep.id.replace('dep_', '')}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-semibold text-white text-xs">{dep.user_name || 'Customer'}</p>
                      <p className="text-[11px] font-mono text-slate-400">{dep.user_email || '—'}</p>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800">
                        {dep.gateway.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-4 font-mono">
                      <span className="text-white font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 select-all">
                        {dep.transaction_ref || 'N/A (Auto)'}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(dep.amount)}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={dep.status} size="sm" />
                    </td>

                    <td className="px-4 py-4 text-center font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(dep.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      {dep.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => adminApproveDeposit(dep.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => adminRejectDeposit(dep.id, 'Invalid UTR reference')}
                            className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-semibold text-xs transition"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono capitalize">{dep.status}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
