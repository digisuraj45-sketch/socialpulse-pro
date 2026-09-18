import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Zap,
  ShieldCheck,
  Globe,
  TrendingUp,
  Cpu,
  RefreshCw,
  Wallet,
  CheckCircle2,
  ChevronDown,
  Activity,
  Play,
  Share2,
  Clock,
  HelpCircle,
  CreditCard,
  QrCode,
  Users,
  Server,
  Star
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const {
    setCurrentView,
    loginAs,
    categories,
    services,
    formatCurrency,
    activeCurrency
  } = useApp();

  // Interactive Quick Calculator state
  const [calcServiceId, setCalcServiceId] = useState(services[0]?.id || 'srv_101');
  const [calcQuantity, setCalcQuantity] = useState(2500);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Selected service for calculator
  const selectedCalcService = services.find(s => s.id === calcServiceId) || services[0];
  const calculatedPrice = selectedCalcService
    ? (calcQuantity / 1000) * selectedCalcService.selling_rate
    : 0;

  const faqs = [
    {
      q: 'How does SocialPulse Pro process and route orders?',
      a: 'Orders are submitted through our high-speed transaction engine. Once verified against your wallet balance, our smart router selects the optimal provider server based on real-time latency, uptime, and capacity, dispatching fulfillment within milliseconds.'
    },
    {
      q: 'Can I connect my own custom Reseller Child Panel?',
      a: 'Yes! SocialPulse Pro includes white-label child panel architecture. You can connect your custom domain name, define your own markup margin (e.g. +25%), and accept orders under your own brand while our backend fulfills everything automatically.'
    },
    {
      q: 'What payment methods are supported for adding funds?',
      a: 'We support instant Manual UPI with dynamic QR code scanning (designed for Indian users), Razorpay gateway, Stripe, PayPal, and credit/debit cards with automated or one-click verification.'
    },
    {
      q: 'How does the automated 365-Day Refill button work?',
      a: 'Eligible high-retention services feature our one-click Refill guarantee. If count fluctuates within warranty, simply click "Request Refill" in your Orders tab to trigger automatic top-up at zero additional charge.'
    },
    {
      q: 'Is there a developer REST API for external integrations?',
      a: 'Yes, we provide full API v2 support compatible with standard SMM agency protocols. You can fetch services, create orders, check status, and request refills via JSON Bearer token requests.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden border-b border-slate-900">
        {/* Background glow meshes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Power Your Social Marketing Operations</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Manage Social Marketing Services From One{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
              Powerful Platform
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The complete management ecosystem for digital agencies, resellers, and growth marketers. High-speed order routing, multi-provider API synchronization, wallet settlement, and automated refill tracking.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => loginAs('customer')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              <span>Launch Client Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('services')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Explore 45+ Services</span>
            </button>

            <button
              onClick={() => loginAs('admin')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-800/40 font-semibold text-xs transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Demo</span>
            </button>
          </div>

          {/* Platform Metrics Bar */}
          <div className="mt-14 pt-8 border-t border-slate-900/80 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Orders Dispatched</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">2,418,920+</p>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> 99.8% Successful
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg. Start Time</p>
              <p className="text-xl sm:text-2xl font-bold text-indigo-400 font-mono mt-1">1.8 Mins</p>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" /> High-speed dispatch
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Reseller Agencies</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">850+ Active</p>
              <span className="text-[11px] text-purple-400 flex items-center gap-1 mt-0.5">
                <Globe className="w-3 h-3" /> Global White-label
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">API Routing Engine</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono mt-1">&lt; 85ms</p>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Zap className="w-3 h-3" /> REST v2 Protocol
              </span>
            </div>
          </div>

          {/* Original Dashboard Preview Illustration */}
          <div className="mt-14 relative rounded-2xl border border-slate-800 bg-slate-900/80 p-3 sm:p-5 shadow-2xl overflow-hidden max-w-5xl mx-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="font-mono ml-2 text-slate-300">socialpulse-pro://control-center/v2</span>
              </div>
              <span className="font-mono text-emerald-400 text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded">
                ● Routing Engine Active
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <p className="text-xs text-slate-400">Instant Balance Pool</p>
                <p className="text-2xl font-bold text-white font-mono mt-1">$4,850.20</p>
                <p className="text-xs text-emerald-400 mt-1">UPI & Cards Auto-Reconciled</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <p className="text-xs text-slate-400">Active Provider Links</p>
                <p className="text-2xl font-bold text-indigo-400 font-mono mt-1">3 Upstreams</p>
                <p className="text-xs text-slate-300 mt-1">ApexPulse, NovaCloud, DirectSync</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <p className="text-xs text-slate-400">Queue Processing Rate</p>
                <p className="text-2xl font-bold text-purple-400 font-mono mt-1">450 Req/Min</p>
                <p className="text-xs text-slate-300 mt-1">Database Queue • Shared Safe</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE SERVICE CALCULATOR */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-indigo-400">Transparent Pricing</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Interactive Order Cost Calculator</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Select any service and target quantity to inspect rates in {activeCurrency.code} ({activeCurrency.symbol}) with decimal-safe calculations.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Select Service
                  </label>
                  <select
                    value={calcServiceId}
                    onChange={(e) => {
                      setCalcServiceId(e.target.value);
                      const s = services.find(srv => srv.id === e.target.value);
                      if (s) setCalcQuantity(s.min_quantity * 2);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        [{s.service_type.toUpperCase()}] {s.name.slice(0, 60)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
                    <span>Desired Quantity</span>
                    <span className="font-mono text-indigo-300 font-bold">{calcQuantity.toLocaleString()} Units</span>
                  </div>
                  <input
                    type="range"
                    min={selectedCalcService?.min_quantity || 100}
                    max={selectedCalcService?.max_quantity ? Math.min(selectedCalcService.max_quantity, 50000) : 50000}
                    step={100}
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(Number(e.target.value))}
                    className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                    <span>Min: {(selectedCalcService?.min_quantity || 100).toLocaleString()}</span>
                    <span>Max: {(selectedCalcService?.max_quantity || 50000).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rate per 1,000 units:</span>
                    <span className="font-mono font-semibold text-white">{formatCurrency(selectedCalcService?.selling_rate || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average fulfillment time:</span>
                    <span className="font-mono text-emerald-400">{selectedCalcService?.average_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Refill warranty:</span>
                    <span className="font-mono text-indigo-300">
                      {selectedCalcService?.refill_enabled ? `${selectedCalcService.refill_days} Days Auto-Refill` : 'Standard Delivery'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Output Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-950 to-slate-950 border border-indigo-900/40 text-center space-y-4">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">Total Estimated Cost</span>
                <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  {formatCurrency(calculatedPrice)}
                </div>
                <p className="text-xs text-slate-400">
                  Calculated dynamically at <span className="font-mono text-slate-300">({calcQuantity.toLocaleString()} / 1,000) × {formatCurrency(selectedCalcService?.selling_rate || 0)}</span>
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      loginAs('customer');
                      setCurrentView('new-order');
                    }}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
                  >
                    <span>Place Order Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICE CATEGORIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-indigo-400">Comprehensive Catalog</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Covering Every Major Digital Channel</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Multi-platform marketing infrastructure with targeted engagement, follower growth, content distribution, and SEO signals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setCurrentView('services')}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 font-mono tracking-wide">{cat.platform}</span>
                <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                  {services.filter(s => s.category_id === cat.id).length} Services
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-2 group-hover:text-indigo-300 transition">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center text-xs font-semibold text-slate-300 group-hover:text-indigo-400 transition">
                <span>Browse Services</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-20 bg-slate-900/30 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-indigo-400">Streamlined Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">How SocialPulse Pro Works</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Three simple steps to execute high-volume digital marketing operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold font-mono text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Deposit to Dedicated Wallet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fund your secure wallet using Instant UPI QR, Razorpay, Stripe, or PayPal. Your funds are protected by atomic ledger transactions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold font-mono text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Select Service & Input Details</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose your service, paste the target link, enter quantity, or configure drip-feed runs. The system verifies wallet limits in real time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold font-mono text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Automated Delivery & Refills</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our smart routing engine submits the order to verified upstream providers. Track start counts, remains, and trigger refills with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES BENTO GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-indigo-400">Enterprise Engineering</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Built For Uncompromising Reliability</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Engineered specifically to avoid VPS lock-in and deploy seamlessly on Hostinger Web/Cloud environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Hostinger-First Architecture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero mandatory Docker, Redis, or Node.js runtime servers required. Fully operational via Laravel 13, Database Queues, and Standard Shared Hosting Cron.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Automated Refills & Refunds</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Guaranteed customer safety: If an upstream provider cancels or only partially delivers, our ledger automatically computes and credits proportional refunds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Indian UPI & Global Gateways</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native support for India-friendly Manual UPI with QR generation and UTR reconciliation, alongside Razorpay, Stripe, and PayPal abstractions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 w-fit">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">White-Label Child Panels</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empower resellers to connect custom domains and sell your catalog with automated markups, customized themes, and isolated client accounts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Developer REST API v2</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full Bearer API key authentication with rate limiting, error logging, and standard endpoints for services, balance, add order, and refill status.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Audit Trail & RBAC</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Comprehensive security posture with TOTP 2FA, granular role-based access control, CSRF mitigation, and immutable wallet transaction logging.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="py-20 bg-slate-900/30 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-indigo-400">Questions Answered</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-sm font-semibold text-white hover:text-indigo-300"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>

                {openFaqIndex === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Accelerate Your Social Marketing Fulfillment?
          </h2>
          <p className="mt-3 text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Create an account or test the live portal in under 30 seconds. Seamlessly deployable on Hostinger Web/Cloud hosting.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => loginAs('customer')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition"
            >
              Access Customer Dashboard
            </button>
            <button
              onClick={() => setCurrentView('hostinger-hub')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition"
            >
              Inspect Hostinger & Laravel 13 Blueprint
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
