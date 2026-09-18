import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import {
  TrendingUp,
  Receipt,
  Wallet,
  Users,
  Server,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  CheckCircle2,
  Play
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    orders,
    deposits,
    users,
    providers,
    formatCurrency,
    setCurrentView,
    adminSyncProviders,
    addToast
  } = useApp();

  const totalInflow = deposits
    .filter(d => d.status === 'approved')
    .reduce((acc, d) => acc + d.amount, 0);

  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'in_progress');

  const totalProviderFunds = providers.reduce((acc, p) => acc + p.balance, 0);

  const handlePulse = () => {
    adminSyncProviders();
    addToast('success', 'Cron Pulse Triggered', 'All upstream provider balances and queues synchronized.');
  };

  return (
    <div className="space-y-8">
      {/* Super Admin Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400">Master Operations Control</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Admin System Nexus
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global monitoring for order routing, provider balances, UPI reconciliation, and service margins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePulse}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Trigger Cron Pulse</span>
          </button>
          <button
            onClick={() => setCurrentView('admin-deposits')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
              pendingDeposits.length > 0
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-900 text-slate-300 border border-slate-700'
            }`}
          >
            <Wallet className="w-4 h-4 text-amber-400" />
            <span>{pendingDeposits.length} UPI Pending</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Platform Inflow"
          value={formatCurrency(totalInflow)}
          subtitle="Processed deposits ledger"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Active Order Queue"
          value={activeOrders.length}
          subtitle={`${orders.length} total lifetime orders`}
          icon={Receipt}
          color="blue"
        />
        <StatCard
          title="Pending Manual UPI"
          value={pendingDeposits.length}
          subtitle="Requires UTR verification"
          icon={AlertTriangle}
          color={pendingDeposits.length > 0 ? 'amber' : 'emerald'}
        />
        <StatCard
          title="Upstream Provider Liquidity"
          value={formatCurrency(totalProviderFunds)}
          subtitle={`${providers.length} connected APIs`}
          icon={Server}
          color="purple"
        />
      </div>

      {/* Two Column Layout: Orders Activity & Provider Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Master Orders Stream (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Live Ingestion & Fulfillment Queue</h3>
              <p className="text-xs text-slate-400">All customer dispatches across connected SMM providers</p>
            </div>
            <button
              onClick={() => setCurrentView('admin-orders')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Manage Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Selling / Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.slice(0, 5).map((order) => {
                    const client = users.find(u => u.id === order.user_id);
                    const provider = providers.find(p => p.id === order.provider_id);
                    return (
                      <tr key={order.id} className="hover:bg-slate-850/40 transition">
                        <td className="px-4 py-3.5 font-mono text-slate-400 font-bold">
                          #{order.id.replace('ord_', '')}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-white truncate">{client?.name || 'Customer'}</p>
                          <p className="text-[11px] font-mono text-slate-400">@{client?.username}</p>
                        </td>
                        <td className="px-4 py-3.5 max-w-xs">
                          <p className="font-medium text-white truncate">{order.service_name}</p>
                          <p className="text-[11px] font-mono text-purple-400 truncate">Provider: {provider?.name || 'Standard v2'}</p>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <StatusBadge status={order.status} size="sm" />
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono">
                          <span className="text-white font-bold">{formatCurrency(order.charge)}</span>
                          <span className="text-[10px] text-emerald-400 block font-normal">
                            Profit: +{formatCurrency(order.profit)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upstream Providers & Operations status (1 Column) */}
        <div className="space-y-6">
          {/* Provider Liquidity Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Upstream Balances</h4>
              <button
                onClick={() => setCurrentView('admin-providers')}
                className="text-[11px] text-purple-400 hover:underline"
              >
                Sync All
              </button>
            </div>

            <div className="space-y-2.5">
              {providers.map(prov => (
                <div key={prov.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{prov.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{prov.base_url.replace('https://', '').replace('/api/v2', '')}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    ${prov.balance.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Operational Shortcuts</h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setCurrentView('admin-deposits')}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 flex items-center justify-between text-left transition"
              >
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-200">Reconcile UPI UTR Deposits</span>
                </div>
                {pendingDeposits.length > 0 && (
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {pendingDeposits.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('admin-users')}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 flex items-center justify-between text-left transition"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-200">Manual Credit/Debit User Wallet</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => setCurrentView('admin-cron')}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 flex items-center justify-between text-left transition"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-200">Inspect 5-Min Cron Workers</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
