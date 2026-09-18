import React, { useState } from 'react';
import { ShieldCheck, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const PublicTermsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'aup' | 'refund' | 'privacy'>('terms');

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Legal & Policy Center</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Platform Terms & Compliance</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            SocialPulse Pro operates under strict compliance standards, clear service disclaimers, and transparent fulfillment criteria.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'terms' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('aup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'aup' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Acceptable Use Policy (AUP)
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'refund' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Refund & Cancellation Policy
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'privacy' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Privacy & Cookies
          </button>
        </div>

        {/* Content Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-6">
          {activeTab === 'terms' && (
            <>
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Platform Nature & Non-Organic Disclaimer</h4>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    SocialPulse Pro is a digital marketing service management and fulfillment routing platform. We do not promise, guarantee, or represent that any service will result in organic virality, algorithmic permanence, or financial return. Services are fulfilled strictly as promotional metrics.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">1. Account Registration & Wallet Management</h3>
                <p>
                  Users must maintain valid account credentials and preserve confidentiality of their authentication keys. All orders require pre-funded wallet balances. Debits are recorded through immutable transaction logs.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">2. Upstream Provider Routing</h3>
                <p>
                  Orders are dispatched via external upstream service providers. Start counts, delivery speeds, and progress intervals are governed by provider infrastructure and social platform updates.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">3. Platform Changes</h3>
                <p>
                  Social platforms routinely modify internal algorithms and display metrics. SocialPulse Pro administrators reserve the right to modify, re-rate, or disable any service without prior notice if upstream conditions dictate.
                </p>
              </section>
            </>
          )}

          {activeTab === 'aup' && (
            <>
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Strict Anti-Abuse Standards</h4>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    This platform does not build or supply functionality intended to bypass third-party platform security, anti-bot protections, CAPTCHA systems, rate limits, or account protections.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">Prohibited Activities</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li>Orders targeting political misinformation, election interference, or hate speech.</li>
                  <li>Promoting fraudulent investment schemes, Ponzi operations, or cryptocurrency scams.</li>
                  <li>Executing denial-of-service, automated flood attacks, or mass scraping using our API.</li>
                  <li>Submitting targets subject to copyright infringement or non-consensual imagery.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">Administrative Enforcement</h3>
                <p>
                  Accounts violating this Acceptable Use Policy will be terminated immediately without balance refund, and associated IP addresses permanently blacklisted.
                </p>
              </section>
            </>
          )}

          {activeTab === 'refund' && (
            <>
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">1. Deposit Policy</h3>
                <p>
                  Once funds are deposited to your wallet, they are non-refundable to original payment methods unless mandated by consumer protection laws. Deposited balances remain available indefinitely for service orders.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">2. Order Cancellations & Partial Refunds</h3>
                <p>
                  If an order cannot be completed by upstream providers, the system automatically marks the order as <strong className="text-rose-400 font-mono">cancelled</strong> or <strong className="text-purple-400 font-mono">partial</strong> and instantly refunds the unfulfilled balance back to your internal wallet.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">3. Refill Protocol (365-Day Guarantee)</h3>
                <p>
                  Services marked with the Refill badge include automated refill warranties. If metric counts decline within the stated warranty window, you may click the &quot;Request Refill&quot; button in your Orders dashboard to trigger an automated top-up.
                </p>
              </section>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">Data Privacy & Storage</h3>
                <p>
                  We store essential user records (email, username, encrypted password hashes, wallet balances, and order target links) exclusively to deliver services. We do not sell, barter, or distribute your customer lists or private target URLs to external data aggregators.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">Cookies & Session Tracking</h3>
                <p>
                  We use strictly essential cookies for secure session maintenance, CSRF validation, and user preference storage (such as dark mode and preferred currency).
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
