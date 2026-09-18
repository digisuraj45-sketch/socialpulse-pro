import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';
import { UpiScannerCard } from '../../components/UpiScannerCard';
import {
  Wallet,
  QrCode,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Gift,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

export const UserAddFundsView: React.FC = () => {
  const {
    userWallet,
    formatCurrency,
    convertFromUsd,
    convertToUsd,
    activeCurrency,
    submitDeposit,
    addToast
  } = useApp();

  const [selectedGateway, setSelectedGateway] = useState<PaymentMethod>('upi_manual');
  const [amountUsd, setAmountUsd] = useState<number>(50);
  const [utrNumber, setUtrNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simulatingPayment, setSimulatingPayment] = useState(false);

  const upiId = 'Weomtech@ibl';
  const amountInInr = (amountUsd * 86.50).toFixed(2);

  // Gateways metadata
  const gateways = [
    {
      id: 'upi_manual',
      name: 'Instant Manual UPI / QR (India)',
      tag: 'Zero Fee • Fast Admin Approval',
      desc: 'Scan QR with GPay, PhonePe, Paytm, BHIM, or any banking app. Enter 12-digit UTR.',
      icon: QrCode,
      min: 10,
      max: 5000,
      fee: '0%',
      recommended: true
    },
    {
      id: 'razorpay',
      name: 'Razorpay Gateway (India & Cards)',
      tag: 'Instant Auto-Credit',
      desc: 'UPI, RuPay, Visa, Mastercard, NetBanking, and Wallets.',
      icon: Zap,
      min: 10,
      max: 3000,
      fee: '0%',
      recommended: false
    },
    {
      id: 'stripe',
      name: 'Stripe International Cards',
      tag: 'Global Visa / MC / Amex',
      desc: 'Worldwide credit and debit card processing with 3D Secure verification.',
      icon: CreditCard,
      min: 20,
      max: 10000,
      fee: '3.0%',
      recommended: false
    },
    {
      id: 'mock_instant',
      name: 'Instant Sandbox Mock Deposit',
      tag: 'Testing & Evaluation Only',
      desc: 'Simulate instant server-side payment credit with 1 click.',
      icon: Sparkles,
      min: 5,
      max: 5000,
      fee: '0%',
      recommended: false
    }
  ];

  const currentGateway = gateways.find(g => g.id === selectedGateway) || gateways[0];

  // Fee calculation
  const feeRate = selectedGateway === 'stripe' ? 0.03 : 0;
  const feeAmount = Number((amountUsd * feeRate).toFixed(2));
  const finalPayable = Number((amountUsd + feeAmount).toFixed(2));

  // Copy UPI ID
  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    addToast('success', 'UPI ID Copied', `${upiId} copied to clipboard.`);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Handle Submit
  const handleProceedPayment = () => {
    if (amountUsd < currentGateway.min) {
      addToast('error', 'Minimum Limit', `Minimum deposit for this method is $${currentGateway.min}.`);
      return;
    }

    if (selectedGateway === 'upi_manual') {
      if (!utrNumber || utrNumber.trim().length < 8) {
        addToast('error', 'Missing UTR', 'Please provide the 12-digit UPI Transaction / UTR reference number.');
        return;
      }

      submitDeposit({
        gateway: 'upi_manual',
        amount: amountUsd,
        transactionRef: utrNumber.trim(),
        couponCode: couponCode ? couponCode.trim() : undefined
      });

      setUtrNumber('');
    } else {
      // Open simulated modal
      setIsModalOpen(true);
    }
  };

  const handleSimulatedPaymentSuccess = () => {
    setSimulatingPayment(true);
    setTimeout(() => {
      setSimulatingPayment(false);
      setIsModalOpen(false);

      submitDeposit({
        gateway: selectedGateway,
        amount: amountUsd,
        transactionRef: `GW-${Date.now().toString().slice(-8)}`,
        couponCode: couponCode ? couponCode.trim() : undefined
      });
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Wallet Funding Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Add Funds to Wallet</h1>
          <p className="text-xs text-slate-400 mt-1">Multi-channel gateway settlement with instant or fast admin reconciliation.</p>
        </div>

        {userWallet && (
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Balance</p>
              <p className="text-lg font-bold text-emerald-400 font-mono leading-none">
                {formatCurrency(userWallet.balance)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Options (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Gateway Cards */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              1. Choose Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gateways.map((gw) => {
                const Icon = gw.icon;
                const isSelected = selectedGateway === gw.id;
                return (
                  <div
                    key={gw.id}
                    onClick={() => setSelectedGateway(gw.id as PaymentMethod)}
                    className={`p-4 rounded-2xl border transition cursor-pointer relative ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-600/10'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {gw.recommended && (
                      <span className="absolute top-3 right-3 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Popular
                      </span>
                    )}
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`p-2 rounded-xl border ${isSelected ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs text-white">{gw.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{gw.desc}</p>
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Fee: {gw.fee}</span>
                      <span>Min: ${gw.min}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Amount input */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              2. Enter Deposit Amount (USD Base)
            </label>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 font-mono">$</span>
                <input
                  type="number"
                  min={currentGateway.min}
                  max={currentGateway.max}
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(Math.max(1, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-base font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Quick presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[25, 50, 100, 250, 500].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmountUsd(val)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-mono font-semibold transition ${
                      amountUsd === val ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-300 border border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Approximate in active currency if INR */}
            <p className="text-xs text-slate-400">
              Equivalent Value: <strong className="text-emerald-400 font-mono">{formatCurrency(amountUsd)}</strong> (INR ~₹{amountInInr})
            </p>

            {/* Coupon Code Input */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-indigo-400" />
                <span>Promo / Deposit Bonus Code (Try: WELCOME10)</span>
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="WELCOME10"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono uppercase text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Special Section: Manual UPI Real Scannable QR & Instructions */}
          {selectedGateway === 'upi_manual' && (
            <UpiScannerCard
              upiId={upiId}
              amountInInr={amountInInr}
              amountUsd={amountUsd}
              utrNumber={utrNumber}
              setUtrNumber={setUtrNumber}
            />
          )}

          <button
            onClick={handleProceedPayment}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition flex items-center justify-center gap-2"
          >
            <span>
              {selectedGateway === 'upi_manual' ? 'Submit UPI Deposit For Verification' : `Pay ${formatCurrency(finalPayable)} via Gateway`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Summary (1 Column) */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Deposit Breakdown</span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">Secure Gateway</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Chosen Method:</span>
                <span className="font-semibold text-white truncate max-w-[140px]">{currentGateway.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Base Deposit Amount:</span>
                <span className="font-mono text-white font-bold">{formatCurrency(amountUsd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gateway Surcharge Fee:</span>
                <span className="font-mono text-slate-300">{formatCurrency(feeAmount)} ({currentGateway.fee})</span>
              </div>
              {couponCode === 'WELCOME10' && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promo Bonus (+10%):</span>
                  <span className="font-mono">+{formatCurrency(amountUsd * 0.1)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 text-center space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Payable</span>
              <p className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {formatCurrency(finalPayable)}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Wallet Protection Rules</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Deposited funds are immediately registered into your atomic wallet ledger. Once confirmed, you can place unlimited orders across any service.
            </p>
          </div>
        </div>
      </div>

      {/* Simulated Gateway Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-white text-sm">Simulated {currentGateway.name}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Merchant:</span>
                <span className="font-bold text-white">SocialPulse Pro Global</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Charge:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{formatCurrency(finalPayable)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Channel:</span>
                <span className="text-slate-300 font-mono">{selectedGateway.toUpperCase()}</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-2">
              <p>This is a simulated sandbox checkout verifying server-side webhook reconciliation.</p>
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">
                Clicking &quot;Authorize Payment&quot; triggers verified webhook callback and updates your wallet balance immediately.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
              >
                Decline
              </button>
              <button
                type="button"
                disabled={simulatingPayment}
                onClick={handleSimulatedPaymentSuccess}
                className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>{simulatingPayment ? 'Verifying...' : 'Authorize Payment'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
