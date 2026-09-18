import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, Download, Search, Filter, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const UserTransactionsView: React.FC = () => {
  const { currentUser, transactions, formatCurrency, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const userTransactions = useMemo(() => {
    return transactions
      .filter(t => t.user_id === currentUser?.id)
      .filter(t => {
        const matchesSearch =
          t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.reference_id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === 'all' || t.type === typeFilter;
        return matchesSearch && matchesType;
      });
  }, [transactions, currentUser, searchTerm, typeFilter]);

  const exportCsv = () => {
    const headers = ['Transaction ID', 'Type', 'Amount USD', 'Balance Before', 'Balance After', 'Reference', 'Description', 'Date'];
    const rows = userTransactions.map(t => [
      t.id,
      t.type,
      t.amount,
      t.balance_before,
      t.balance_after,
      t.reference_id,
      `"${t.description.replace(/"/g, '""')}"`,
      t.created_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SocialPulse_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'CSV Exported', 'Downloaded complete wallet transaction statement.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Atomic Financial Ledger</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Wallet Transactions</h1>
          <p className="text-xs text-slate-400 mt-1">Immutable record of every debit, credit, deposit, and automated refund.</p>
        </div>

        <button
          onClick={exportCsv}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Export CSV Statement</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by description or reference..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'deposit', 'order_debit', 'refund', 'referral_credit', 'manual_credit', 'manual_debit'].map(tp => (
            <button
              key={tp}
              onClick={() => setTypeFilter(tp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition whitespace-nowrap ${
                typeFilter === tp
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tp.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Tx ID</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Description & Reference</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
                <th className="px-4 py-3.5 text-right">Balance Before</th>
                <th className="px-4 py-3.5 text-right">Balance After</th>
                <th className="px-4 py-3.5 text-center">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {userTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No ledger transactions match your criteria.
                  </td>
                </tr>
              ) : (
                userTransactions.map((tx) => {
                  const isPositive = tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'referral_credit' || tx.type === 'manual_credit';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-850/50 transition">
                      <td className="px-4 py-4 font-mono font-bold text-slate-400">
                        #{tx.id.replace('tx_', '')}
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase px-2 py-0.5 rounded-full border ${
                          isPositive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {isPositive ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-4 max-w-sm">
                        <p className="font-semibold text-white text-xs">{tx.description}</p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">Ref: {tx.reference_id}</p>
                      </td>

                      <td className={`px-4 py-4 text-right font-mono font-bold text-sm ${isPositive ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {isPositive ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>

                      <td className="px-4 py-4 text-right font-mono text-slate-400">
                        {formatCurrency(tx.balance_before)}
                      </td>

                      <td className="px-4 py-4 text-right font-mono font-bold text-white">
                        {formatCurrency(tx.balance_after)}
                      </td>

                      <td className="px-4 py-4 text-center font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
