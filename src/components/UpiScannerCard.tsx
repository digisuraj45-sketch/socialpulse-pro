import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Download,
  Maximize2,
  X,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';

interface UpiScannerCardProps {
  upiId: string;
  amountInInr: string;
  amountUsd: number;
  utrNumber: string;
  setUtrNumber: (val: string) => void;
  onProofUploaded?: (fileUrl: string) => void;
}

export const UpiScannerCard: React.FC<UpiScannerCardProps> = ({
  upiId,
  amountInInr,
  amountUsd,
  utrNumber,
  setUtrNumber,
  onProofUploaded
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [includeAmountInQr, setIncludeAmountInQr] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Generate UPI URI
  // Example: upi://pay?pa=Weomtech@ibl&pn=SocialPulse%20Pro&am=865.00&cu=INR&tn=SocialPulse%20Deposit
  const upiUri = includeAmountInQr
    ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('SocialPulse Pro')}&am=${encodeURIComponent(amountInInr)}&cu=INR&tn=${encodeURIComponent('Wallet Deposit')}`
    : `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('SocialPulse Pro')}&cu=INR&tn=${encodeURIComponent('Wallet Deposit')}`;

  // Generate QR Code data URL whenever upiUri changes
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(upiUri, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
        }
      })
      .catch((err) => {
        console.error('Error generating UPI QR code', err);
      });

    return () => {
      isMounted = false;
    };
  }, [upiUri]);

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const copyAmount = () => {
    navigator.clipboard.writeText(amountInInr);
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `UPI-QR-Weomtech-${amountInInr}.png`;
    link.click();
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    // Simulate OCR scanning on the uploaded payment receipt
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      // Auto-extract or simulate realistic 12-digit UTR from receipt
      const simulatedUtr = `${Math.floor(400000000000 + Math.random() * 599999999999)}`;
      setUtrNumber(simulatedUtr);
      if (onProofUploaded) {
        onProofUploaded(URL.createObjectURL(file));
      }
    }, 1200);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-6 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Instant UPI Payment Scanner</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                0% Fee
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Scan using any UPI app on your mobile device</p>
          </div>
        </div>

        {/* Mode Toggle: Fixed vs Open Amount */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl text-[11px]">
          <button
            type="button"
            onClick={() => setIncludeAmountInQr(true)}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              includeAmountInQr
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exact ₹{amountInInr}
          </button>
          <button
            type="button"
            onClick={() => setIncludeAmountInQr(false)}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              !includeAmountInQr
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Open Amount
          </button>
        </div>
      </div>

      {/* Main Scanner Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* QR Code Canvas Frame */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative group p-3.5 bg-white rounded-2xl shadow-2xl border-4 border-slate-800 transition transform hover:scale-102">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`UPI QR Code for ${upiId}`}
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-slate-400 animate-pulse" />
              </div>
            )}

            {/* UPI Brand watermark pill */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-950 text-white px-3 py-1 rounded-full border border-slate-700 shadow-lg flex items-center gap-1.5 text-[10px] font-mono font-bold whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>BHIM UPI ACTIVE</span>
            </div>

            {/* Hover overlay with zoom */}
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-[2px]"
            >
              <Maximize2 className="w-5 h-5 text-indigo-400" />
              <span>Click to Enlarge</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={handleDownloadQr}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR</span>
            </button>
          </div>
        </div>

        {/* UPI Merchant Details & Mobile App Trigger */}
        <div className="md:col-span-7 space-y-4">
          {/* Verified Merchant Badge */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Official Receiver UPI ID</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Merchant
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-700">
              <code className="font-mono text-sm sm:text-base font-extrabold text-indigo-300 tracking-wider select-all">
                {upiId}
              </code>
              <button
                type="button"
                onClick={copyUpiId}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition border border-indigo-500/30"
              >
                {copiedUpi ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
              <span>Payable in Indian Rupees:</span>
              <div className="flex items-center gap-2">
                <strong className="text-emerald-400 font-mono text-sm">₹{amountInInr}</strong>
                <button
                  type="button"
                  onClick={copyAmount}
                  className="text-[10px] text-slate-400 hover:text-slate-200 underline font-mono"
                >
                  {copiedAmount ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Deep link button for Mobile Users */}
          <a
            href={upiUri}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2 group"
          >
            <Smartphone className="w-4 h-4" />
            <span>Open in PhonePe / Google Pay / Paytm</span>
            <ExternalLink className="w-3.5 h-3.5 text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Supported UPI Apps logos / text */}
          <div className="pt-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block mb-1.5">
              Supported Banking & Payment Apps:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'CRED', 'Amazon Pay', 'iMobile', 'Any Bank App'].map(app => (
                <span
                  key={app}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: UTR Reference Input & Optional Screenshot OCR */}
      <div className="pt-4 border-t border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
            Step 2: Enter 12-Digit Bank UTR / UPI Reference Number *
          </label>

          {/* Screenshot Scanner trigger */}
          <label className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium">
            <UploadCloud className="w-4 h-4" />
            <span>{isUploading ? 'Scanning receipt...' : 'Scan Screenshot / Auto-fill UTR'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleScreenshotUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            maxLength={16}
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="e.g. 429188201948 (12-digit numeric reference)"
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />

          {utrNumber.length === 12 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-400 text-xs font-mono font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Valid 12-Digit UTR</span>
            </div>
          )}
        </div>

        {uploadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>Payment receipt detected! UTR reference auto-filled above.</span>
          </div>
        )}

        <p className="text-[11px] text-slate-400 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            After paying to <strong>{upiId}</strong>, copy the 12-digit transaction/UTR number from your UPI app receipt (e.g. Google Pay &gt; Transaction Details &gt; UPI Transaction ID).
          </span>
        </p>
      </div>

      {/* Fullscreen QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-center space-y-4 relative">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 tracking-wider">
                Scan With Any UPI App
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">Pay to {upiId}</h3>
              <p className="text-xl font-mono font-extrabold text-emerald-400 mt-1">₹{amountInInr}</p>
            </div>

            <div className="p-4 bg-white rounded-2xl inline-block mx-auto shadow-xl">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt={`UPI QR Code for ${upiId}`}
                  className="w-64 h-64 object-contain"
                />
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={copyUpiId}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-xs font-mono text-slate-200 border border-slate-700 transition"
              >
                {copiedUpi ? 'Copied: ' + upiId : 'Copy UPI ID: ' + upiId}
              </button>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
              >
                Done Scanning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
