import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Lock, Mail, ArrowRight, User, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { loginAs, setCurrentView, addToast } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      addToast('error', 'Missing Credentials', 'Please enter your username/email and password.');
      return;
    }

    // If identifier is admin
    if (identifier.toLowerCase().includes('admin')) {
      loginAs('admin');
    } else {
      loginAs('customer');
    }
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
          Sign In To Portal
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Or{' '}
          <button
            onClick={() => setCurrentView('register')}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            create a new customer account
          </button>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 py-8 px-6 sm:px-8 border border-slate-800 shadow-2xl rounded-2xl space-y-6">
          {/* Quick Demo Fillers */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              1-Click Instant Evaluation
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAs('customer')}
                className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <User className="w-3.5 h-3.5" /> Customer (Suraj)
              </button>
              <button
                type="button"
                onClick={() => loginAs('admin')}
                className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Super Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Username or Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="digisuraj or admin@socialpulsepro.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => addToast('info', 'Password Reset', 'A reset verification link would be dispatched via Laravel Scheduler.')}
                  className="text-[11px] text-indigo-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0" />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
            >
              <span>Authenticate & Enter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
