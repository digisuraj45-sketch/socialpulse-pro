import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Copy, Check, Gift, ArrowUpRight, DollarSign, Award } from 'lucide-react';

export const UserReferralsView: React.FC = () => {
  const { currentUser, formatCurrency, addToast } = useApp();
  const [copied, setCopied] = useState(false);

  const referralCode = currentUser?.referral_code || 'SURAJ45';
  const referralLink = `https://socialpulsepro.com/register?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    addToast('success', 'Affiliate Link Copied', 'Share with friends or agency clients.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Affiliate Engine</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Referral & Commission Program</h1>
          <p className="text-xs text-slate-400 mt-1">Earn a lifetime 5.0% passive commission on every deposit made by your referrals.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[11px] font-mono uppercase text-slate-400">Referred Clients</span>
          <p className="text-2xl font-extrabold text-white">14 Accounts</p>
          <span className="text-[11px] text-emerald-400 font-semibold">+3 this month</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[11px] font-mono uppercase text-slate-400">Commission Rate</span>
          <p className="text-2xl font-extrabold text-indigo-400 font-mono">5.0%</p>
          <span className="text-[11px] text-slate-400">Instant credit on deposit</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[11px] font-mono uppercase text-slate-400">Total Affiliate Earnings</span>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">{formatCurrency(148.50)}</p>
          <span className="text-[11px] text-slate-400">Credited to wallet</span>
        </div>
      </div>

      {/* Referral Link Box */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider font-mono">
          <Gift className="w-4 h-4" />
          <span>Your Unique Referral Link</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-indigo-300 select-all focus:outline-none"
          />
          <button
            onClick={copyLink}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Link' : 'Copy Affiliate Link'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Your referral code is <strong className="text-white font-mono">{referralCode}</strong>. When a client signs up using your link or enters your code at registration, they receive a +5% bonus on their initial deposit, and you earn 5% on all their deposits indefinitely.
        </p>
      </div>
    </div>
  );
};
