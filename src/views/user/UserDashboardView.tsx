import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Wallet,
  ShoppingBag,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  ArrowRight,
  Plus,
  RefreshCw,
  Receipt,
  Layers,
  LifeBuoy
} from 'lucide-react';

export const UserDashboardView: React.FC = () => {
  const {
    currentUser,
    userWallet,
    orders,
    transactions,
    formatCurrency,
    setCurrentView,
    requestRefill
  } = useApp();

  const userOrders = orders.filter(o => o.user_id === currentUser?.id);
  const completedOrders = userOrders.filter(o => o.status === 'completed');
  const activeOrders = userOrders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'in_progress');
  const userTransactions = transactions.filter(t => t.user_id === currentUser?.id);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400">Client Control Center</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Welcome, {currentUser?.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Account Status: <strong className="text-emerald-400">Verified Client</strong> • Tier: <strong className="text-slate-200">Agency Reseller</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('new-order')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Place New Order</span>
          </button>
          <button
            onClick={() => setCurrentView('add-funds')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Deposit Funds</span>
          </button>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Wallet Balance"
          value={formatCurrency(userWallet?.balance || 0)}
          subtitle="Ready for order execution"
          icon={Wallet}
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value={userOrders.length}
          subtitle={`${completedOrders.length} completed`}
          icon={ShoppingBag}
          color="indigo"
        />
        <StatCard
          title="Orders In Progress"
          value={activeOrders.length}
          subtitle="Live upstream processing"
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Total Spend"
          value={formatCurrency(userWallet?.total_spent || 0)}
          subtitle="All-time fulfillment"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Two Column Layout: Recent Orders & Recent Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Recent Service Orders</h3>
              <p className="text-xs text-slate-400">Latest social marketing fulfillment tasks</p>
            </div>
            <button
              onClick={() => setCurrentView('orders')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Charge</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {userOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                        No orders recorded yet. Click &quot;Place New Order&quot; to begin.
                      </td>
                    </tr>
                  ) : (
                    userOrders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3.5 font-mono text-slate-400 font-bold">
                          #{order.id.replace('ord_', '')}
                        </td>
                        <td className="px-4 py-3.5 max-w-xs">
                          <p className="font-medium text-white truncate">{order.service_name}</p>
                          <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">{order.link}</p>
                        </td>
                        <td className="px-4 py-3.5 font-mono font-bold text-emerald-400">
                          {formatCurrency(order.charge)}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={order.status} size="sm" />
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {order.refill_status === 'eligible' && (
                            <button
                              onClick={() => requestRefill(order.id)}
                              className="px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold transition"
                            >
                              Refill
                            </button>
                          )}
                          {order.refill_status === 'requested' && (
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                              Refill Queued
                            </span>
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

        {/* Recent Transactions & Quick Actions (1 Column) */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Quick Tools</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setCurrentView('new-order')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left transition"
              >
                <Layers className="w-4 h-4 text-indigo-400 mb-1" />
                <p className="font-semibold text-white">New Order</p>
                <p className="text-[10px] text-slate-400">Deploy service</p>
              </button>
              <button
                onClick={() => setCurrentView('add-funds')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left transition"
              >
                <Wallet className="w-4 h-4 text-emerald-400 mb-1" />
                <p className="font-semibold text-white">Add Funds</p>
                <p className="text-[10px] text-slate-400">UPI / Cards</p>
              </button>
              <button
                onClick={() => setCurrentView('api-keys')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left transition"
              >
                <Receipt className="w-4 h-4 text-purple-400 mb-1" />
                <p className="font-semibold text-white">API Keys</p>
                <p className="text-[10px] text-slate-400">Generate token</p>
              </button>
              <button
                onClick={() => setCurrentView('support')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left transition"
              >
                <LifeBuoy className="w-4 h-4 text-amber-400 mb-1" />
                <p className="font-semibold text-white">Help Desk</p>
                <p className="text-[10px] text-slate-400">Open ticket</p>
              </button>
            </div>
          </div>

          {/* Recent Wallet Transactions */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Recent Ledger</h4>
              <button
                onClick={() => setCurrentView('transactions')}
                className="text-[11px] text-indigo-400 hover:underline"
              >
                All
              </button>
            </div>

            <div className="space-y-2.5">
              {userTransactions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No transactions found.</p>
              ) : (
                userTransactions.slice(0, 4).map(tx => (
                  <div key={tx.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white text-[11px] truncate max-w-[180px]">{tx.description}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Bal: {formatCurrency(tx.balance_after)}</p>
                    </div>
                    <span className={`font-mono font-bold text-xs ${tx.type === 'deposit' || tx.type === 'refund' ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
