import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Terminal, Copy, Check, Play, Shield, Code, Server, Zap } from 'lucide-react';

export const PublicApiDocsView: React.FC = () => {
  const { services, orders, userWallet, formatCurrency, addToast } = useApp();
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'php' | 'python' | 'node'>('curl');
  const [copied, setCopied] = useState(false);

  // Interactive tester states
  const [testAction, setTestAction] = useState<'services' | 'balance' | 'status' | 'add'>('services');
  const [testOrderId, setTestOrderId] = useState(orders[0]?.id || 'ord_10842');
  const [testServiceId, setTestServiceId] = useState(services[0]?.id || 'srv_101');
  const [testLink, setTestLink] = useState('https://instagram.com/testprofile');
  const [testQuantity, setTestQuantity] = useState(1000);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  const endpointUrl = 'https://api.socialpulsepro.com/api/v2';

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('success', 'Copied to Clipboard', 'API code snippet ready to paste.');
    setTimeout(() => setCopied(false), 2000);
  };

  const executeApiTest = () => {
    setApiLoading(true);
    setTimeout(() => {
      setApiLoading(false);
      if (testAction === 'services') {
        const payload = services.slice(0, 3).map(s => ({
          service: Number(s.id.replace('srv_', '')),
          name: s.name,
          type: s.service_type,
          category: s.category_id,
          rate: s.selling_rate.toFixed(2),
          min: s.min_quantity,
          max: s.max_quantity,
          refill: s.refill_enabled
        }));
        setApiResponse(JSON.stringify(payload, null, 2));
      } else if (testAction === 'balance') {
        setApiResponse(JSON.stringify({
          status: 'success',
          balance: userWallet ? userWallet.balance.toFixed(2) : '142.80',
          currency: 'USD'
        }, null, 2));
      } else if (testAction === 'status') {
        const ord = orders.find(o => o.id === testOrderId) || orders[0];
        setApiResponse(JSON.stringify({
          status: ord.status,
          charge: ord.charge.toFixed(2),
          start_count: ord.start_count,
          remains: ord.remains,
          currency: 'USD'
        }, null, 2));
      } else if (testAction === 'add') {
        const srv = services.find(s => s.id === testServiceId) || services[0];
        const charge = ((testQuantity / 1000) * srv.selling_rate).toFixed(2);
        setApiResponse(JSON.stringify({
          status: 'success',
          order: Math.floor(10000 + Math.random() * 90000),
          charge,
          currency: 'USD'
        }, null, 2));
      }
    }, 450);
  };

  const getCodeSnippet = () => {
    if (selectedLanguage === 'curl') {
      return `curl -X POST ${endpointUrl} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"action": "services"}'`;
    }
    if (selectedLanguage === 'php') {
      return `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${endpointUrl}");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'action' => 'services'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
$data = json_decode($response, true);
print_r($data);`;
    }
    if (selectedLanguage === 'python') {
      return `import requests

url = "${endpointUrl}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "action": "services"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;
    }
    return `const response = await fetch("${endpointUrl}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ action: "services" })
});

const data = await response.json();
console.log(data);`;
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Developer Protocol</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">REST API Documentation v2</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Standard SMM v2 protocol with Bearer authorization, rate-limiting, idempotency, and automated order fulfillment.
          </p>
        </div>

        {/* Auth & Endpoint Spec */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider font-mono">
              <Shield className="w-4 h-4" />
              <span>Authentication</span>
            </div>
            <h3 className="text-base font-bold text-white">Bearer API Key Token</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Include your active API key in the HTTP <code className="text-indigo-300 font-mono">Authorization</code> header as a Bearer token or pass it in the JSON body as <code className="text-indigo-300 font-mono">key</code>. You can generate multiple scoped keys from your User Panel.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              Authorization: Bearer spp_live_948f2bd0384192bfa0348
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider font-mono">
              <Server className="w-4 h-4" />
              <span>Production Endpoint</span>
            </div>
            <h3 className="text-base font-bold text-white">Global Unified Gateway</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All requests must be dispatched via HTTP POST with JSON body payloads. Rate limited to 60 requests per minute by default.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
              POST {endpointUrl}
            </div>
          </div>
        </div>

        {/* Code Snippets Section */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold text-white">Client Implementation Examples</span>
            </div>
            <div className="flex items-center gap-2">
              {(['curl', 'php', 'python', 'node'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                    selectedLanguage === lang
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
              <button
                onClick={() => copySnippet(getCodeSnippet())}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition ml-2"
                title="Copy snippet"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto">
            <code>{getCodeSnippet()}</code>
          </pre>
        </div>

        {/* Interactive Live API Tester */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-base font-bold text-white">Interactive Sandbox & Tester</h3>
                <p className="text-xs text-slate-400">Dispatch live mock API queries against SocialPulse Pro router</p>
              </div>
            </div>
            <button
              onClick={executeApiTest}
              disabled={apiLoading}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{apiLoading ? 'Executing...' : 'Dispatch Request'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Select Action
                </label>
                <select
                  value={testAction}
                  onChange={(e) => {
                    setTestAction(e.target.value as any);
                    setApiResponse(null);
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="services">action=services (Fetch Service Catalog)</option>
                  <option value="balance">action=balance (Check Wallet Funds)</option>
                  <option value="status">action=status (Query Order Status)</option>
                  <option value="add">action=add (Place New Order)</option>
                </select>
              </div>

              {testAction === 'status' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={testOrderId}
                    onChange={(e) => setTestOrderId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              )}

              {testAction === 'add' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Service
                    </label>
                    <select
                      value={testServiceId}
                      onChange={(e) => setTestServiceId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white"
                    >
                      {services.map(s => (
                        <option key={s.id} value={s.id}>#{s.id.replace('srv_', '')} - {s.name.slice(0, 40)}...</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Link / URL
                    </label>
                    <input
                      type="text"
                      value={testLink}
                      onChange={(e) => setTestLink(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={testQuantity}
                      onChange={(e) => setTestQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Output view */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                JSON Response Output
              </label>
              <pre className="h-48 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-y-auto">
                {apiResponse || '// Click "Dispatch Request" above to simulate live API execution'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
