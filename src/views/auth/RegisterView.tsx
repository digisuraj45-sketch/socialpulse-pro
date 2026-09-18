import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, User, Mail, Lock, Gift, ArrowRight } from 'lucide-react';

export const RegisterView: React.FC = () => {
  const { loginAs, setCurrentView, addToast } = useApp();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreed, setAgreed] = useState(true);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email || !password) {
      addToast('error', 'Validation Error', 'Please complete all required fields.');
      return;
    }
    if (!agreed) {
      addToast('warning', 'Terms Acceptance Required', 'Please accept our Terms of Service & AUP.');
      return;
    }

    addToast('success', 'Account Registered', `Welcome ${fullName}! Your client wallet has been provisioned.`);
    loginAs('customer');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">SOCIALPULSE <span className="text-indigo-400">PRO</span></span>
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
          Create Client Account
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Already registered?{' '}
          <button
            onClick={() => setCurrentView('login')}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Sign in here
          </button>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 py-8 px-6 sm:px-8 border border-slate-800 shadow-2xl rounded-2xl space-y-4">
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Suraj Sharma"
                required
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="digisuraj"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="suraj@example.com"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Referral Code (Optional)</span>
                <span className="text-[10px] text-indigo-400 font-normal">Bonus +5% On First Deposit</span>
              </label>
              <div className="relative">
                <Gift className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="SURAJ45"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-400 leading-tight">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="rounded mt-0.5 bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>
                  I agree to the <button type="button" onClick={() => setCurrentView('terms')} className="text-indigo-400 hover:underline">Terms of Service</button> and acknowledge the non-organic promotional service disclaimer.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 mt-2"
            >
              <span>Create Account & Provision Wallet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
