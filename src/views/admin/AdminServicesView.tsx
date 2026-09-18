import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Layers,
  Search,
  Plus,
  Edit2,
  Power,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  Clock,
  RefreshCw
} from 'lucide-react';

export const AdminServicesView: React.FC = () => {
  const { services, categories, adminToggleServiceStatus, formatCurrency, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingService, setEditingService] = useState<any | null>(null);
  const [newSellingRate, setNewSellingRate] = useState<number>(0);

  const filteredServices = services.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || s.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenRateEdit = (service: any) => {
    setEditingService(service);
    setNewSellingRate(service.selling_rate);
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    editingService.selling_rate = newSellingRate;
    addToast('success', 'Rate Updated', `${editingService.name} updated to $${newSellingRate}/1k.`);
    setEditingService(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-purple-900/30">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">Inventory & Margins</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Services & Pricing Architecture</h1>
          <p className="text-xs text-slate-400 mt-1">Configure client rates, enable/disable violating services, and adjust provider routing.</p>
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter services by name or ID..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Categories ({services.length})</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.platform}: {c.name}</option>
          ))}
        </select>
      </div>

      {/* Services Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">ID</th>
                <th className="px-4 py-3.5">Service Name & Type</th>
                <th className="px-4 py-3.5 text-right">Provider Cost</th>
                <th className="px-4 py-3.5 text-right">Selling Rate</th>
                <th className="px-4 py-3.5 text-right">Gross Margin</th>
                <th className="px-4 py-3.5 text-center">Limits (Min/Max)</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No services match the active filters.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => {
                  const grossMargin = service.selling_rate - service.provider_rate;
                  const marginPercent = service.provider_rate > 0
                    ? Math.round((grossMargin / service.provider_rate) * 100)
                    : 0;

                  return (
                    <tr key={service.id} className="hover:bg-slate-850/50 transition">
                      <td className="px-4 py-4 font-mono font-bold text-slate-400">
                        #{service.id.replace('srv_', '')}
                      </td>

                      <td className="px-4 py-4 max-w-sm">
                        <p className="font-semibold text-white text-xs">{service.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                          <span className="capitalize">{service.service_type}</span>
                          <span>•</span>
                          <span>Avg: {service.average_time}</span>
                          {service.refill_enabled && (
                            <span className="text-indigo-400">• {service.refill_days}d Refill</span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right font-mono text-slate-400">
                        ${service.provider_rate.toFixed(2)}
                      </td>

                      <td className="px-4 py-4 text-right font-mono font-bold text-white text-sm">
                        {formatCurrency(service.selling_rate)}
                      </td>

                      <td className="px-4 py-4 text-right font-mono">
                        <span className="text-emerald-400 font-bold">+{formatCurrency(grossMargin)}</span>
                        <span className="text-[10px] text-slate-400 block font-normal">({marginPercent}%)</span>
                      </td>

                      <td className="px-4 py-4 text-center font-mono text-[11px] text-slate-300">
                        {service.min_quantity.toLocaleString()} - {service.max_quantity.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          service.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          {service.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenRateEdit(service)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                          title="Edit Rate & Price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => adminToggleServiceStatus(service.id)}
                          className={`p-1.5 rounded-lg transition ${
                            service.status === 'active'
                              ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                          title={service.status === 'active' ? 'Disable Service (Violating Rules / Outage)' : 'Enable Service'}
                        >
                          <Power className="w-3.5 h-3.5" />
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

      {/* Edit Rate Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Edit Selling Rate</h3>
              <button onClick={() => setEditingService(null)} className="text-xs text-slate-400 hover:text-white">
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveRate} className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-white">{editingService.name}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Provider Base Cost: ${editingService.provider_rate.toFixed(2)} / 1k</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  New Selling Rate / 1,000 (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={editingService.provider_rate}
                  value={newSellingRate}
                  onChange={(e) => setNewSellingRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-purple-500"
                />
                <span className="text-[11px] text-emerald-400 font-mono block mt-1">
                  Gross Profit Margin: +${(newSellingRate - editingService.provider_rate).toFixed(2)} / 1,000
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25"
                >
                  Update Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
