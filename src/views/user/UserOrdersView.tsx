import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { OrderStatus } from '../../types';
import {
  Search,
  Filter,
  RefreshCw,
  XCircle,
  ExternalLink,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const UserOrdersView: React.FC = () => {
  const {
    currentUser,
    orders,
    formatCurrency,
    requestRefill,
    requestCancel,
    setCurrentView
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const userOrders = useMemo(() => {
    return orders
      .filter(o => o.user_id === currentUser?.id)
      .filter(o => {
        const matchesSearch =
          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.link.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [orders, currentUser, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Fulfillment Records</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Orders Management</h1>
          <p className="text-xs text-slate-400 mt-1">Track delivery progress, remains, automated refill warranties, and cancellations.</p>
        </div>

        <button
          onClick={() => setCurrentView('new-order')}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center gap-1.5"
        >
          <Layers className="w-4 h-4" />
          <span>New Order</span>
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
            placeholder="Search by Order ID, link, or service..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'pending', 'processing', 'in_progress', 'completed', 'partial', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">ID</th>
                <th className="px-4 py-3.5">Service & Link</th>
                <th className="px-4 py-3.5 text-center">Quantity</th>
                <th className="px-4 py-3.5 text-center">Start / Remains</th>
                <th className="px-4 py-3.5 text-right">Charge</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-center">Created</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {userOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                userOrders.map((order) => {
                  const percentDelivered = order.quantity > 0
                    ? Math.min(100, Math.round(((order.quantity - order.remains) / order.quantity) * 100))
                    : 0;

                  return (
                    <tr key={order.id} className="hover:bg-slate-850/50 transition">
                      <td className="px-4 py-4 font-mono font-bold text-slate-400">
                        #{order.id.replace('ord_', '')}
                      </td>

                      <td className="px-4 py-4 max-w-xs">
                        <p className="font-semibold text-white text-xs truncate">{order.service_name}</p>
                        <a
                          href={order.link.startsWith('http') ? order.link : `https://${order.link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono text-indigo-400 hover:underline flex items-center gap-1 mt-0.5 truncate"
                        >
                          <span className="truncate">{order.link}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </td>

                      <td className="px-4 py-4 text-center font-mono font-bold text-white">
                        {order.quantity.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <div className="font-mono text-[11px] text-slate-300">
                          {order.start_count.toLocaleString()} / <span className="text-amber-400">{order.remains.toLocaleString()}</span>
                        </div>
                        {order.status !== 'cancelled' && order.status !== 'refunded' && (
                          <div className="w-20 mx-auto bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              className="bg-indigo-500 h-full rounded-full transition-all"
                              style={{ width: `${percentDelivered}%` }}
                            />
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 text-right font-mono font-bold text-emerald-400 text-sm">
                        {formatCurrency(order.charge)}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <StatusBadge status={order.status} size="sm" />
                      </td>

                      <td className="px-4 py-4 text-center font-mono text-[11px] text-slate-400">
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="px-4 py-4 text-right space-x-1 whitespace-nowrap">
                        {order.refill_status === 'eligible' && (
                          <button
                            onClick={() => requestRefill(order.id)}
                            className="px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold transition inline-flex items-center gap-1"
                            title="Request Refill Warranty"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Refill</span>
                          </button>
                        )}

                        {order.refill_status === 'requested' && (
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            Refill Queued
                          </span>
                        )}

                        {(order.status === 'pending' || order.status === 'processing') && (
                          <button
                            onClick={() => requestCancel(order.id)}
                            className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold transition inline-flex items-center gap-1"
                            title="Cancel Order & Refund"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Cancel</span>
                          </button>
                        )}
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
