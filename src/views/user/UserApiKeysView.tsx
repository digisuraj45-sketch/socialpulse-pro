import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Code, Copy, Check, RefreshCw, Trash2, Key, Shield, Plus, Terminal } from 'lucide-react';

export const UserApiKeysView: React.FC = () => {
  const { apiKeys, generateApiKey, revokeApiKey, addToast } = useApp();
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      addToast('error', 'Label Required', 'Please provide an identifier for this API key.');
      return;
    }
    generateApiKey(newKeyName.trim());
    setNewKeyName('');
  };

  const copyToClipboard = (token: string, id: string) => {
    navigator.clipboard.writeText(token);
    setCopiedKeyId(id);
    addToast('success', 'Token Copied', 'Bearer API key copied to clipboard.');
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Developer Tokens</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">API v2 Keys</h1>
          <p className="text-xs text-slate-400 mt-1">Authenticate automated panel integrations, child panels, and custom applications.</p>
        </div>
      </div>

      {/* Generate Key Form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider font-mono">
          <Plus className="w-4 h-4" />
          <span>Generate New API Key</span>
        </div>

        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="e.g. Production Child Panel #1 or WHMCS Bot"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Generate Token</span>
          </button>
        </form>
      </div>

      {/* Active Keys List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Configured Authentication Keys</h3>

        <div className="space-y-3">
          {apiKeys.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No active API keys found. Generate one above to access the SMM v2 REST API.
            </div>
          ) : (
            apiKeys.map((key) => (
              <div
                key={key.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{key.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs font-mono text-indigo-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                      {key.full_key || `${key.key_prefix}••••••••••••••••••••••••`}
                    </code>
                    <button
                      onClick={() => copyToClipboard(key.full_key || `${key.key_prefix}••••••••••••••••••••••••`, key.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Copy Key"
                    >
                      {copiedKeyId === key.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1">
                    Created: {new Date(key.created_at).toLocaleDateString()} • Scopes: <code className="text-slate-300 font-mono">read:services, write:orders, read:balance</code>
                  </p>
                </div>

                <button
                  onClick={() => revokeApiKey(key.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Revoke Key</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
