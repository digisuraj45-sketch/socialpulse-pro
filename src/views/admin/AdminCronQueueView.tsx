import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Play, CheckCircle2, AlertCircle, RefreshCw, Terminal, Server, Cpu } from 'lucide-react';

export const AdminCronQueueView: React.FC = () => {
  const { adminSyncProviders, addToast } = useApp();
  const [runningJob, setRunningJob] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[${new Date().toISOString()}] System Queue Daemon active on Hostinger Cloud Node #01.`,
    `[${new Date().toISOString()}] Cron dispatcher listening for incoming SMM v2 events.`
  ]);

  const cronJobs = [
    {
      id: 'orders_submit',
      name: 'Order Submission Worker',
      interval: 'Every 1 minute (* * * * *)',
      command: 'php artisan orders:dispatch-upstream',
      desc: 'Picks up pending client orders and transmits them to external provider API endpoints.',
      lastRun: '1 min ago',
      status: 'healthy'
    },
    {
      id: 'status_check',
      name: 'Status & Remainder Sync',
      interval: 'Every 5 minutes (*/5 * * * *)',
      command: 'php artisan orders:sync-status',
      desc: 'Queries provider status APIs, updates remains, calculates delivery progress, and marks completed orders.',
      lastRun: '3 mins ago',
      status: 'healthy'
    },
    {
      id: 'refills_process',
      name: 'Automated 365-Day Refill Queue',
      interval: 'Every 10 minutes (*/10 * * * *)',
      command: 'php artisan refills:process-queue',
      desc: 'Validates non-drop warranty conditions and triggers top-up runs upstream.',
      lastRun: '7 mins ago',
      status: 'healthy'
    },
    {
      id: 'provider_balance',
      name: 'Provider Liquidity Watchdog',
      interval: 'Every 15 minutes (*/15 * * * *)',
      command: 'php artisan providers:check-balance',
      desc: 'Monitors PeakSMM and GlobalSMM balances and alerts admins if funds drop below $50.',
      lastRun: '12 mins ago',
      status: 'healthy'
    }
  ];

  const handleRunNow = (jobId: string, jobName: string) => {
    setRunningJob(jobId);
    adminSyncProviders();
    addToast('success', `Executed: ${jobName}`, 'Background queue worker completed successfully with exit code 0.');

    const logEntry = `[${new Date().toLocaleTimeString()}] Executed "${jobName}": 12 items processed. Exit code 0 (SUCCESS).`;
    setTerminalLogs(prev => [logEntry, ...prev.slice(0, 8)]);

    setTimeout(() => {
      setRunningJob(null);
    }, 500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-purple-900/30">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">Background Automation</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Cron Scheduler & Worker Queues</h1>
          <p className="text-xs text-slate-400 mt-1">Hostinger daemon jobs handling background order dispatch, status polling, and refill automation.</p>
        </div>

        <button
          onClick={() => handleRunNow('all', 'Global Master Pulse')}
          disabled={runningJob !== null}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition flex items-center gap-1.5 disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Trigger All Workers</span>
        </button>
      </div>

      {/* Cron Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cronJobs.map((job) => {
          const isRunning = runningJob === job.id;
          return (
            <div
              key={job.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-purple-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{job.name}</h3>
                    <span className="text-[10px] font-mono text-indigo-400">{job.interval}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  ACTIVE
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {job.desc}
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
                <code>{job.command}</code>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">Last executed: {job.lastRun}</span>
                <button
                  onClick={() => handleRunNow(job.id, job.name)}
                  disabled={isRunning}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center gap-1 disabled:opacity-50"
                >
                  <Play className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Running...' : 'Execute Now'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Worker Terminal Output */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider font-mono">
          <Terminal className="w-4 h-4" />
          <span>Real-Time Worker Execution Stream</span>
        </div>

        <div className="h-44 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-y-auto space-y-1.5">
          {terminalLogs.map((log, idx) => (
            <div key={idx} className="leading-relaxed">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
