import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  DollarSign,
  PlusCircle,
  MinusCircle,
  ShieldAlert,
  UserCheck,
  UserX,
  Receipt,
  ArrowRight
} from 'lucide-react';

export const AdminUsersView: React.FC = () => {
  const { users, wallets, adminAdjustWallet, formatCurrency, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustingUser, setAdjustingUser] = useState<any | null>(null);
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustAmount, setAdjustAmount] = useState<number>(25);
  const [adjustNote, setAdjustNote] = useState('');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdjust = (user: any) => {
    setAdjustingUser(user);
    setAdjustAmount(25);
    setAdjustNote('');
    setAdjustType('credit');
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingUser || adjustAmount <= 0) return;

    adminAdjustWallet(adjustingUser.id, adjustAmount, adjustType, adjustNote || 'Administrative manual adjustment');
    setAdjustingUser(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-purple-900/30">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">Client Directory</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">User & Balance Administration</h1>
          <p className="text-xs text-slate-400 mt-1">Audit customer wallets, execute manual debits/credits, and supervise account authorization.</p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, handle, or email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">ID</th>
                <th className="px-4 py-3.5">Client Identity</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5 text-right">Active Balance</th>
                <th className="px-4 py-3.5 text-right">Lifetime Spent</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-center">Registered</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredUsers.map((user) => {
                const userWallet = wallets[user.id];
                return (
                  <tr key={user.id} className="hover:bg-slate-850/50 transition">
                    <td className="px-4 py-4 font-mono font-bold text-slate-400">
                      #{user.id.replace('usr_', '')}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-semibold text-white text-xs">{user.name}</p>
                      <p className="text-[11px] font-mono text-slate-400">@{user.username} • {user.email}</p>
                    </td>

                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(userWallet?.balance || 0)}
                    </td>

                    <td className="px-4 py-4 text-right font-mono text-slate-300">
                      {formatCurrency(userWallet?.total_spent || 0)}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center font-mono text-[11px] text-slate-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenAdjust(user)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition inline-flex items-center gap-1"
                      >
                        <DollarSign className="w-3 h-3" />
                        <span>Adjust Balance</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Balance Modal */}
      {adjustingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Adjust User Balance</h3>
              <button onClick={() => setAdjustingUser(null)} className="text-xs text-slate-400 hover:text-white">
                Cancel
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <p className="text-white font-bold">{adjustingUser.name} (@{adjustingUser.username})</p>
              <p className="text-slate-400 font-mono">Current Balance: {formatCurrency(wallets[adjustingUser.id]?.balance || 0)}</p>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('credit')}
                  className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    adjustType === 'credit'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Manual Credit (+)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('debit')}
                  className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    adjustType === 'debit'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  <MinusCircle className="w-4 h-4" />
                  <span>Manual Debit (-)</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Reason / Ledger Memo *
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="e.g. VIP deposit bonus, cash deposit, or dispute chargeback"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingUser(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`w-1/2 py-2.5 rounded-xl font-bold text-xs shadow-lg transition ${
                    adjustType === 'credit'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                  }`}
                >
                  Confirm {adjustType.toUpperCase()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
