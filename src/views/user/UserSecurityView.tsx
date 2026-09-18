import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Smartphone, Key, Lock, CheckCircle2, QrCode } from 'lucide-react';

export const UserSecurityView: React.FC = () => {
  const { addToast } = useApp();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast('error', 'Incomplete Form', 'Please enter your current and new password.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    addToast('success', 'Security Credentials Updated', 'Your workstation password was successfully renewed.');
  };

  const toggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    if (!twoFactorEnabled) {
      addToast('success', '2FA Enabled', 'Authenticator app (Google Authenticator / Authy) linked successfully.');
    } else {
      addToast('info', '2FA Disabled', 'Two-factor security disabled on your account.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="pb-6 border-b border-slate-800">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Security & Authentication</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Account Security & 2FA</h1>
        <p className="text-xs text-slate-400 mt-1">Manage TOTP two-factor authentication, cryptographic passwords, and active device sessions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2FA Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Two-Factor Authentication</h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              {twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Require a 6-digit TOTP security code from Google Authenticator, Microsoft Authenticator, or 1Password during login and wallet withdrawals.
          </p>

          {twoFactorEnabled ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Authenticator Active</span>
              </div>
              <button
                onClick={toggle2FA}
                className="text-xs text-rose-400 hover:underline font-semibold"
              >
                Disable
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-14 h-14 text-slate-950" />
                </div>
                <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                  <span className="block text-white font-bold">Secret Key:</span>
                  <code className="text-indigo-300">JBSWY3DPEHPK3PXP</code>
                </div>
              </div>

              <button
                onClick={toggle2FA}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition"
              >
                Activate Two-Factor Authentication
              </button>
            </div>
          )}
        </div>

        {/* Change Password Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Change Workstation Password</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                New Secure Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition mt-2"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
