import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, RefreshCw, Clock, ArrowRight, Layers, ShieldCheck } from 'lucide-react';

export const PublicServicesView: React.FC = () => {
  const { categories, services, formatCurrency, loginAs, setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = selectedCategory === 'all' || service.category_id === selectedCategory;
      const matchesType = serviceTypeFilter === 'all' || service.service_type === serviceTypeFilter;

      return matchesSearch && matchesCat && matchesType;
    });
  }, [services, searchTerm, selectedCategory, serviceTypeFilter]);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Real-Time Catalog</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Digital Marketing Services</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Transparent pricing per 1,000 units. High-speed fulfillment with automated delivery tracking and refill support.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ID or description..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Platforms ({services.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.platform}: {c.name.slice(0, 24)}...</option>
              ))}
            </select>

            <select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Service Types</option>
              <option value="followers">Followers / Members</option>
              <option value="likes">Likes / Reactions</option>
              <option value="views">Retention Views</option>
              <option value="custom_comments">Custom Comments</option>
              <option value="traffic">Web & Keyword Traffic</option>
            </select>
          </div>
        </div>

        {/* Services Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">ID</th>
                  <th className="px-4 py-3.5">Service Name & Description</th>
                  <th className="px-4 py-3.5 text-right">Rate / 1k</th>
                  <th className="px-4 py-3.5 text-center">Min / Max</th>
                  <th className="px-4 py-3.5 text-center">Avg. Time</th>
                  <th className="px-4 py-3.5 text-center">Refill</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                      No services match your active search filters.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map(s => {
                    const cat = categories.find(c => c.id === s.category_id);
                    return (
                      <tr key={s.id} className="hover:bg-slate-850/50 transition">
                        <td className="px-4 py-4 font-mono font-bold text-slate-400">
                          #{s.id.replace('srv_', '')}
                        </td>
                        <td className="px-4 py-4 max-w-md">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {cat?.platform || 'General'}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase font-mono">{s.service_type}</span>
                          </div>
                          <p className="font-semibold text-white text-xs">{s.name}</p>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{s.description}</p>
                        </td>
                        <td className="px-4 py-4 text-right font-mono font-bold text-emerald-400 text-sm">
                          {formatCurrency(s.selling_rate)}
                        </td>
                        <td className="px-4 py-4 text-center font-mono text-[11px] text-slate-400">
                          {s.min_quantity.toLocaleString()} / {s.max_quantity.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-center font-mono text-slate-300">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {s.average_time}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center font-mono">
                          {s.refill_enabled ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {s.refill_days}D Refill
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => {
                              loginAs('customer');
                              setCurrentView('new-order');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition inline-flex items-center gap-1"
                          >
                            <span>Order</span>
                            <ArrowRight className="w-3 h-3" />
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
      </div>
    </div>
  );
};
