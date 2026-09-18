import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Server, QrCode, Shield, Save, Copy, Check, Terminal, Globe } from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { addToast } = useApp();
  const [platformName, setPlatformName] = useState('SocialPulse Pro');
  const [supportEmail, setSupportEmail] = useState('support@socialpulsepro.com');
  const [corporateUpi, setCorporateUpi] = useState('Weomtech@ibl');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [copiedCron, setCopiedCron] = useState(false);

  const cronString = '* * * * * cd /home/u123456789/public_html && php artisan schedule:run >> /dev/null 2>&1';

  const copyCronCommand = () => {
    navigator.clipboard.writeText(cronString);
    setCopiedCron(true);
    addToast('success', 'Crontab String Copied', 'Paste into Hostinger hPanel Cron Jobs.');
    setTimeout(() => setCopiedCron(false), 2000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Configuration Committed', 'Global platform parameters updated successfully.');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-purple-900/30">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">Environment & Infrastructure</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Platform & Hostinger Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Configure global payment parameters, gateway accounts, and Hostinger hPanel server automation.</p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">General Platform Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Platform Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* UPI Gateway Settings */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Manual UPI Payment Routing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Merchant Corporate UPI ID
              </label>
              <input
                type="text"
                value={corporateUpi}
                onChange={(e) => setCorporateUpi(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Displayed on the dynamic client Add Funds QR code screen.</p>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-0"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Platform Maintenance Mode</span>
                  <span className="text-[11px] text-slate-400">Temporarily pause new order ingestion</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition flex items-center gap-2"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </form>

      {/* Hostinger Deployment Reference Guide */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Hostinger Web & Cloud Server Configuration</h3>
            <p className="text-xs text-slate-400">Complete architectural instructions for zero-downtime deployment on Hostinger hPanel.</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-xs uppercase font-mono text-purple-400">1. Hostinger hPanel Cron Setup (Mandatory)</h4>
            <p className="text-slate-400">
              Navigate to <strong>Hostinger hPanel &gt; Advanced &gt; Cron Jobs</strong>. Select &quot;Common Settings: Every Minute (* * * * *)&quot; and configure the command:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-indigo-300 font-mono text-xs overflow-x-auto">
                {cronString}
              </code>
              <button
                type="button"
                onClick={copyCronCommand}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex-shrink-0"
                title="Copy Cron Command"
              >
                {copiedCron ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-xs uppercase font-mono text-emerald-400">2. PHP Environment Specs</h4>
              <p className="text-slate-400">
                • PHP 8.2 or 8.3 Recommended.<br />
                • Required extensions: <code className="text-white font-mono">curl, pdo_mysql, bcmath, mbstring, openssl</code>.<br />
                • <code className="text-white font-mono">max_execution_time</code> set to 300s for bulk sync.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-xs uppercase font-mono text-indigo-400">3. Database & SSL</h4>
              <p className="text-slate-400">
                • Hostinger Managed MySQL 8.0 or MariaDB.<br />
                • InnoDB storage engine for ACID wallet transactions.<br />
                • Free Let&apos;s Encrypt Lifetime SSL enabled in hPanel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
