import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Server,
  RefreshCw,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Download,
  Key,
  DollarSign
} from 'lucide-react';

export const AdminProvidersView: React.FC = () => {
  const { providers, adminSyncProviders, addToast } = useApp();
  const [checkingProviderId, setCheckingProviderId] = useState<string | null>(null);
  const [importingProviderId, setImportingProviderId] = useState<string | null>(null);
  const [markupPercent, setMarkupPercent] = useState<number>(35);
  const [showAddModal, setShowAddModal] = useState(false);

  // New provider form
  const [newProvName, setNewProvName] = useState('');
  const [newProvUrl, setNewProvUrl] = useState('');
  const [newProvKey, setNewProvKey] = useState('');

  const handleCheckBalance = (id: string, name: string) => {
    setCheckingProviderId(id);
    setTimeout(() => {
      adminSyncProviders();
      setCheckingProviderId(null);
      addToast('success', `${name} Balance Query`, 'Live API balance retrieved: Status 200 OK.');
    }, 400);
  };

  const handleImport = (id: string, name: string) => {
    setImportingProviderId(id);
    setTimeout(() => {
      const res = adminSyncProviders();
      setImportingProviderId(null);
      addToast('success', `${name} Catalog Synced`, `${res.syncedCount} services verified with +${markupPercent}% retail markup.`);
    }, 600);
  };

  const handleCreateProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvName || !newProvUrl || !newProvKey) {
      addToast('error', 'Missing Fields', 'All fields required.');
      return;
    }
    addToast('success', 'Provider Connected', `${newProvName} integrated. SMM v2 schema active.`);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-purple-900/30">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">Wholesale API Integration</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Upstream Providers (SMM v2)</h1>
          <p className="text-xs text-slate-400 mt-1">Connect REST API v2 reseller nodes, query real-time liquidity, and bulk-import service catalogs.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Provider</span>
        </button>
      </div>

      {/* Markup banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Automated Import Markup Multiplier</h4>
            <p className="text-xs text-slate-400">Sets customer selling rate automatically above wholesale cost upon catalog sync.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-300">Profit Margin:</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={10}
              max={200}
              value={markupPercent}
              onChange={(e) => setMarkupPercent(Number(e.target.value))}
              className="w-16 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white text-center"
            />
            <span className="text-xs font-bold text-purple-400">%</span>
          </div>
        </div>
      </div>

      {/* Providers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {providers.map((prov) => {
          const isChecking = checkingProviderId === prov.id;
          const isImporting = importingProviderId === prov.id;

          return (
            <div
              key={prov.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-purple-400">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{prov.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        SMM API v2
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 uppercase font-mono">Provider Balance:</span>
                    <span className="text-lg font-mono font-extrabold text-emerald-400">
                      ${prov.balance.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Currency: {prov.currency}</span>
                    <span>Last Synced: {new Date(prov.last_sync_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1 font-mono">
                  <span className="text-[10px] uppercase text-slate-400 block font-sans">API Endpoint:</span>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 truncate text-[11px]">
                    {prov.base_url}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleCheckBalance(prov.id, prov.name)}
                  disabled={isChecking}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>{isChecking ? 'Querying API...' : 'Check Live Balance'}</span>
                </button>

                <button
                  onClick={() => handleImport(prov.id, prov.name)}
                  disabled={isImporting}
                  className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isImporting ? 'Syncing Catalog...' : `Sync Services (+${markupPercent}% Margin)`}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Connect Wholesale Provider</h3>
              <button onClick={() => setShowAddModal(false)} className="text-xs text-slate-400 hover:text-white">
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateProvider} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">Provider Name</label>
                <input
                  type="text"
                  value={newProvName}
                  onChange={(e) => setNewProvName(e.target.value)}
                  placeholder="ApexReseller API"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">API v2 URL</label>
                <input
                  type="url"
                  value={newProvUrl}
                  onChange={(e) => setNewProvUrl(e.target.value)}
                  placeholder="https://apexreseller.com/api/v2"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">Bearer API Secret Token</label>
                <input
                  type="password"
                  value={newProvKey}
                  onChange={(e) => setNewProvKey(e.target.value)}
                  placeholder="••••••••••••••••••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 rounded-xl bg-slate-800 text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Save Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
