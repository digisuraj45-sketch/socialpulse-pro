import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileCheck, Upload, CheckCircle2, Clock, AlertCircle, Shield } from 'lucide-react';

export const UserKycView: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [docType, setDocType] = useState('aadhaar');
  const [docNumber, setDocNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) {
      addToast('error', 'Missing Document Number', 'Please enter your document ID.');
      return;
    }
    setSubmitted(true);
    addToast('success', 'KYC Documents Submitted', 'Our compliance team will review your proof within 1 business day.');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Identity & Compliance</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">KYC Identity Verification</h1>
          <p className="text-xs text-slate-400 mt-1">Unlock high-volume API limits, custom payment rails, and agency tax invoices.</p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Status: Verified Tier 1</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Tier 2 Enterprise Agency Verification</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Submit your government ID (Aadhaar Card, PAN Card, Passport) or Business GSTIN to remove the $5,000 monthly deposit cap.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Verification In Progress</h4>
            <p className="text-xs text-slate-400">
              Documents for <strong className="text-white font-mono">{docNumber}</strong> are currently being inspected by compliance.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="aadhaar">Aadhaar Card (India)</option>
                  <option value="pan">PAN Card (India)</option>
                  <option value="passport">International Passport</option>
                  <option value="gstin">Business GSTIN / Tax Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Document ID Number
                </label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="e.g. 5482 9182 3019 or ABCDE1234F"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Upload Scanned ID (Simulated)
              </label>
              <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-center bg-slate-950 transition cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-white">Click or drag & drop document scan</p>
                <p className="text-[11px] text-slate-400 mt-1">PDF, PNG, JPG up to 10MB</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition"
            >
              Submit KYC For Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
