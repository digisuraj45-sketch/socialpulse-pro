import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, ShieldCheck, Mail, ArrowRight, CheckCircle2, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      addToast('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    addToast('success', 'Subscribed!', 'You are now subscribed to SocialPulse Pro platform product updates.');
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">SOCIALPULSE</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black tracking-widest uppercase bg-indigo-500 text-white">PRO</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              SocialPulse Pro is an original digital marketing service management platform engineered for agencies, resellers, and digital marketing managers. Featuring high-concurrency order routing, automated provider synchronization, and flexible wallet settlement.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-slate-300">
                <strong>Platform Notice & Compliance:</strong> Digital marketing management utility. Does not bypass social network security or bot protections.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-indigo-400 transition">Overview</button>
              </li>
              <li>
                <button onClick={() => setCurrentView('services')} className="hover:text-indigo-400 transition">Service Catalog</button>
              </li>
              <li>
                <button onClick={() => setCurrentView('api-docs')} className="hover:text-indigo-400 transition">API Documentation v2</button>
              </li>
              <li>
                <button onClick={() => setCurrentView('blog')} className="hover:text-indigo-400 transition">Marketing Strategies Blog</button>
              </li>
              <li>
                <button onClick={() => setCurrentView('hostinger-hub')} className="text-indigo-400 font-semibold hover:underline">Hostinger & Laravel Hub</button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">Compliance & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('terms')} className="hover:text-indigo-400 transition">Terms of Service</button>
              </li>
              <li>
                <button onClick={() => setCurrentView('terms')} className="hover:text-indigo-400 transition">Acceptable Use Policy</button>
              </li>
              <li>
                <button onClick={() => setCurrentView('terms')} className="hover:text-indigo-400 transition">Privacy & Cookie Notice</button>
              </li>
              <li>
                <button onClick={() => setCurrentView('terms')} className="hover:text-indigo-400 transition">Refund & Cancellation Rules</button>
              </li>
              <li>
                <button onClick={() => setCurrentView('contact')} className="hover:text-indigo-400 transition">Support Center</button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">Stay Informed</h4>
            <p className="text-xs text-slate-400 mb-3">
              Receive updates on new provider routes and service pricing adjustments.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscribed to alerts!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter business email"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs transition"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-slate-900">
              <span className="text-[11px] text-slate-400 block mb-1">Supported Settlement Channels:</span>
              <div className="flex flex-wrap gap-1.5">
                {['UPI QR', 'Razorpay', 'RuPay', 'Visa/Master', 'Stripe', 'PayPal'].map(badge => (
                  <span key={badge} className="px-2 py-0.5 text-[10px] font-mono bg-slate-900 text-slate-300 rounded border border-slate-800">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} SocialPulse Pro. Original SaaS Platform Architecture.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Server Time: <strong className="font-mono text-slate-300">UTC / Asia/Kolkata</strong></span>
            <span>Hostinger Web/Cloud Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
