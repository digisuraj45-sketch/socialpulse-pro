import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { RefreshCw, ShieldCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const UserRefillsView: React.FC = () => {
  const { currentUser, orders, requestRefill, formatCurrency } = useApp();

  const userOrders = orders.filter(o => o.user_id === currentUser?.id);
  const refillOrders = userOrders.filter(o => o.refill_status && o.refill_status !== 'none');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Automated Replenishment</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Refill Warranty Center</h1>
          <p className="text-xs text-slate-400 mt-1">365-day automated non-drop protection and replenishment dispatch queue.</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="p-6 rounded-3xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">How Does the 365-Day Refill System Work?</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              If an order experiences a natural algorithm-related metric drop within its warranty period, click &quot;Trigger Refill&quot;. The system dispatches an automated replenishment task upstream without any additional charge.
            </p>
          </div>
        </div>
      </div>

      {/* Refills Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">Service</th>
                <th className="px-4 py-3.5">Target Link</th>
                <th className="px-4 py-3.5 text-center">Original Qty</th>
                <th className="px-4 py-3.5 text-center">Refill Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {refillOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No orders currently eligible for refill warranties.
                  </td>
                </tr>
              ) : (
                refillOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-850/50 transition">
                    <td className="px-4 py-4 font-mono font-bold text-slate-400">
                      #{order.id.replace('ord_', '')}
                    </td>
                    <td className="px-4 py-4 max-w-xs font-semibold text-white">
                      {order.service_name}
                    </td>
                    <td className="px-4 py-4 max-w-xs font-mono text-[11px] text-indigo-400 truncate">
                      {order.link}
                    </td>
                    <td className="px-4 py-4 text-center font-mono font-bold text-white">
                      {order.quantity.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {order.refill_status === 'eligible' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Warranty Active
                        </span>
                      )}
                      {order.refill_status === 'requested' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          Refill In Queue
                        </span>
                      )}
                      {order.refill_status === 'completed' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                          Refilled
                        </span>
                      )}
                      {order.refill_status === 'rejected' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          Expired
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {order.refill_status === 'eligible' && (
                        <button
                          onClick={() => requestRefill(order.id)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Trigger Refill</span>
                        </button>
                      )}
                      {order.refill_status === 'requested' && (
                        <span className="text-xs text-slate-400">Processing...</span>
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
