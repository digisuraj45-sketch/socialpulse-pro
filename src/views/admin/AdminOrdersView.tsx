import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { OrderStatus } from '../../types';
import {
  Receipt,
  Search,
  Filter,
  Edit2,
  ExternalLink,
  RefreshCw,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const AdminOrdersView: React.FC = () => {
  const { orders, users, providers, adminUpdateOrderStatus, formatCurrency } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Edit modal state
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('processing');
  const [newRemains, setNewRemains] = useState<number>(0);

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.link.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenEdit = (order: any) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setNewRemains(order.remains);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    adminUpdateOrderStatus(editingOrder.id, newStatus, newRemains);
    setEditingOrder(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-purple-900/30">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">Master Operations</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Master Orders Queue</h1>
          <p className="text-xs text-slate-400 mt-1">Supervise upstream provider routing, manual overrides, partial refunds, and delivery status.</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID, link, or service..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'pending', 'processing', 'in_progress', 'completed', 'partial', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-purple-600 text-white'
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
                <th className="px-4 py-3.5">Client</th>
                <th className="px-4 py-3.5">Service & Link</th>
                <th className="px-4 py-3.5 text-center">Qty / Remains</th>
                <th className="px-4 py-3.5 text-right">Selling (Cost)</th>
                <th className="px-4 py-3.5 text-center">Provider</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No orders match filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const client = users.find(u => u.id === order.user_id);
                  const provider = providers.find(p => p.id === order.provider_id);
                  return (
                    <tr key={order.id} className="hover:bg-slate-850/50 transition">
                      <td className="px-4 py-4 font-mono font-bold text-slate-400">
                        #{order.id.replace('ord_', '')}
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold text-white text-xs">{client?.name || 'Customer'}</p>
                        <p className="text-[11px] font-mono text-slate-400">@{client?.username}</p>
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

                      <td className="px-4 py-4 text-center font-mono">
                        <span className="text-white font-bold">{order.quantity.toLocaleString()}</span> / <span className="text-amber-400">{order.remains.toLocaleString()}</span>
                      </td>

                      <td className="px-4 py-4 text-right font-mono">
                        <span className="text-emerald-400 font-bold">{formatCurrency(order.charge)}</span>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          Cost: ${order.provider_charge.toFixed(2)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-purple-300 border border-slate-800">
                          {provider?.name || 'Standard v2'} #{order.provider_order_id || '901'}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <StatusBadge status={order.status} size="sm" />
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleOpenEdit(order)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Update Order #{editingOrder.id}</h3>
              <button onClick={() => setEditingOrder(null)} className="text-xs text-slate-400 hover:text-white">
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Target Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="partial">Partial (Auto Refund Remains)</option>
                  <option value="cancelled">Cancelled (Full Refund)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Remaining Count (Remains)
                </label>
                <input
                  type="number"
                  min={0}
                  max={editingOrder.quantity}
                  value={newRemains}
                  onChange={(e) => setNewRemains(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  If set to Partial or Cancelled, the system recalculates and refunds unfulfilled units to the client wallet.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25"
                >
                  Commit Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
