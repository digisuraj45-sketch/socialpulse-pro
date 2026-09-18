import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Link as LinkIcon,
  HelpCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Wallet,
  ArrowRight,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';

export const UserNewOrderView: React.FC = () => {
  const {
    categories,
    services,
    userWallet,
    formatCurrency,
    placeOrder,
    setCurrentView,
    addToast
  } = useApp();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || 'cat_ig');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    services.find(s => s.category_id === (categories[0]?.id || 'cat_ig'))?.id || services[0]?.id || ''
  );

  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState<number>(1000);
  const [customComments, setCustomComments] = useState('');
  const [customKeywords, setCustomKeywords] = useState('');
  const [dripFeedEnabled, setDripFeedEnabled] = useState(false);
  const [runs, setRuns] = useState<number>(5);
  const [interval, setInterval] = useState<number>(60); // minutes
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter services by active category
  const categoryServices = useMemo(() => {
    return services.filter(s => s.category_id === selectedCategoryId && s.status === 'active');
  }, [services, selectedCategoryId]);

  // Active selected service
  const currentService = useMemo(() => {
    return services.find(s => s.id === selectedServiceId) || categoryServices[0] || services[0];
  }, [services, selectedServiceId, categoryServices]);

  // Adjust quantity if custom comments used
  const computedQuantity = useMemo(() => {
    if (currentService?.requires_comments) {
      const lines = customComments.split('\n').filter(l => l.trim().length > 0);
      return Math.max(1, lines.length);
    }
    return quantity;
  }, [currentService, customComments, quantity]);

  // Total calculated cost
  const totalMultiplier = dripFeedEnabled ? runs : 1;
  const chargePerRun = currentService ? Number(((computedQuantity / 1000) * currentService.selling_rate).toFixed(4)) : 0;
  const totalCharge = Number((chargePerRun * totalMultiplier).toFixed(4));

  const hasSufficientBalance = userWallet ? userWallet.balance >= totalCharge : false;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentService) {
      addToast('error', 'Error', 'Please select a valid service.');
      return;
    }

    if (!link.trim()) {
      addToast('error', 'Missing Link', 'Target URL or account handle is required.');
      return;
    }

    if (computedQuantity < currentService.min_quantity || computedQuantity > currentService.max_quantity) {
      addToast('error', 'Invalid Quantity', `Quantity must be between ${currentService.min_quantity.toLocaleString()} and ${currentService.max_quantity.toLocaleString()}.`);
      return;
    }

    if (!hasSufficientBalance) {
      addToast('error', 'Insufficient Funds', 'Please top up your wallet balance first.');
      return;
    }

    setIsSubmitting(true);

    const res = placeOrder({
      serviceId: currentService.id,
      link: link.trim(),
      quantity: computedQuantity,
      customData: {
        comments: currentService.requires_comments ? customComments : undefined,
        keywords: currentService.requires_keywords ? customKeywords : undefined,
        runs: dripFeedEnabled ? runs : undefined,
        interval: dripFeedEnabled ? interval : undefined,
      }
    });

    setIsSubmitting(false);

    if (res.success) {
      setLink('');
      setCustomComments('');
      setCustomKeywords('');
      setCurrentView('orders');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Order Dispatch Engine</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">New Marketing Order</h1>
          <p className="text-xs text-slate-400 mt-1">Configure service parameters and target link for immediate fulfillment.</p>
        </div>

        {/* User Balance Badge */}
        {userWallet && (
          <div
            onClick={() => setCurrentView('add-funds')}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex items-center gap-3"
          >
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Available Funds</p>
              <p className="text-base font-bold text-emerald-400 font-mono leading-none">
                {formatCurrency(userWallet.balance)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form (2 Columns) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1. Select Platform Category
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  const newCatId = e.target.value;
                  setSelectedCategoryId(newCatId);
                  const firstSrv = services.find(s => s.category_id === newCatId);
                  if (firstSrv) setSelectedServiceId(firstSrv.id);
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.platform}: {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                2. Select Marketing Service
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                {categoryServices.map(s => (
                  <option key={s.id} value={s.id}>
                    #{s.id.replace('srv_', '')} - {s.name} ({formatCurrency(s.selling_rate)} / 1k)
                  </option>
                ))}
              </select>
            </div>

            {/* Target Link Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>3. Target Link / URL *</span>
                <span className="text-[11px] text-slate-400 font-normal">Account handle or specific post URL</span>
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://instagram.com/p/C9mX... or @username"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Dynamic Custom Comments */}
            {currentService?.requires_comments ? (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Custom Comments (1 Per Line)</span>
                  <span className="text-xs font-mono text-indigo-400 font-bold">
                    Count: {computedQuantity.toLocaleString()}
                  </span>
                </label>
                <textarea
                  rows={5}
                  value={customComments}
                  onChange={(e) => setCustomComments(e.target.value)}
                  placeholder="Awesome presentation!&#10;Highly recommended services.&#10;Keep up the incredible content."
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            ) : (
              /* Standard Quantity Slider & Input */
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Quantity
                  </label>
                  <span className="text-xs font-mono text-slate-400">
                    Min: {currentService?.min_quantity.toLocaleString()} • Max: {currentService?.max_quantity.toLocaleString()}
                  </span>
                </div>
                <input
                  type="number"
                  min={currentService?.min_quantity || 100}
                  max={currentService?.max_quantity || 100000}
                  step={100}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* Dynamic Keywords if SEO / Web traffic */}
            {currentService?.requires_keywords && (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Target Search Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={customKeywords}
                  onChange={(e) => setCustomKeywords(e.target.value)}
                  placeholder="social media management, agency tools, digital branding"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* Drip Feed Toggle */}
            {currentService?.drip_feed_supported && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dripFeedEnabled}
                      onChange={(e) => setDripFeedEnabled(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Enable Drip-Feed Mode</p>
                      <p className="text-[11px] text-slate-400">Gradually deliver quantity over multiple sequential runs</p>
                    </div>
                  </label>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono">
                    Scheduled
                  </span>
                </div>

                {dripFeedEnabled && (
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Runs (Dispatches)</label>
                      <input
                        type="number"
                        min={2}
                        max={30}
                        value={runs}
                        onChange={(e) => setRuns(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Interval (Minutes)</label>
                      <input
                        type="number"
                        min={10}
                        max={1440}
                        value={interval}
                        onChange={(e) => setInterval(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !hasSufficientBalance}
                className={`w-full py-4 rounded-xl font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 ${
                  hasSufficientBalance
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{hasSufficientBalance ? 'Confirm & Dispatch Order' : 'Insufficient Balance — Top Up Wallet'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!hasSufficientBalance && (
                <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
                  <span>Short by {formatCurrency(totalCharge - (userWallet?.balance || 0))}</span>
                  <button
                    type="button"
                    onClick={() => setCurrentView('add-funds')}
                    className="font-bold underline text-rose-300 hover:text-white"
                  >
                    Add Funds Now
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Summary Card (1 Column) */}
        <div className="space-y-6">
          {/* Order Summary Receipt */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Order Calculation</span>
              <span className="text-[11px] font-mono text-indigo-400 font-bold">Auto-Priced</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Service ID:</span>
                <span className="font-mono text-white font-bold">#{currentService?.id.replace('srv_', '')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rate / 1k Units:</span>
                <span className="font-mono text-emerald-400 font-semibold">{formatCurrency(currentService?.selling_rate || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Quantity:</span>
                <span className="font-mono text-white">{computedQuantity.toLocaleString()}</span>
              </div>
              {dripFeedEnabled && (
                <div className="flex justify-between text-indigo-300">
                  <span>Drip Runs Multiplier:</span>
                  <span className="font-mono">× {runs} runs</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Average Time:</span>
                <span className="font-mono text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {currentService?.average_time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Refill Warranty:</span>
                <span className="font-mono text-indigo-300">
                  {currentService?.refill_enabled ? `${currentService.refill_days} Days Free Refill` : 'Standard Delivery'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-center space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Deduction Amount</span>
              <p className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {formatCurrency(totalCharge)}
              </p>
            </div>
          </div>

          {/* Service Description Box */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider font-mono">
              <Info className="w-4 h-4" />
              <span>Service Specification</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentService?.description}
            </p>
            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <p>• Make sure target account is set to <strong>Public</strong>.</p>
              <p>• Never submit duplicate orders to the exact same link until active order finishes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
