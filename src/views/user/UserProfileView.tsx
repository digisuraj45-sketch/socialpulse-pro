import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Globe, DollarSign, Clock, ShieldCheck, Check } from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { currentUser, activeCurrency, setActiveCurrency, addToast } = useApp();
  const [name, setName] = useState(currentUser?.name || 'Suraj Sharma');
  const [email, setEmail] = useState(currentUser?.email || 'suraj@example.com');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +5:30)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Profile Preferences Saved', 'Your account settings have been synchronized.');
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="pb-6 border-b border-slate-800">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Account Preferences</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Profile Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure your personal contact info, display currency, and localization preferences.</p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Username (Immutable)
              </label>
              <input
                type="text"
                readOnly
                value={`@${currentUser?.username}`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 font-mono select-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Default Currency
              </label>
              <select
                value={activeCurrency.code}
                onChange={(e) => setActiveCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="INR">INR (₹ - Indian Rupee)</option>
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="BRL">BRL (R$ - Brazilian Real)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Display Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Asia/Kolkata (IST +5:30)">Asia/Kolkata (IST +5:30)</option>
                <option value="UTC (GMT +0:00)">UTC (GMT +0:00)</option>
                <option value="America/New_York (EST -5:00)">America/New_York (EST -5:00)</option>
                <option value="Europe/London (GMT +1:00)">Europe/London (GMT +1:00)</option>
                <option value="Asia/Dubai (GST +4:00)">Asia/Dubai (GST +4:00)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 mt-4"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </form>
      </div>
    </div>
  );
};
