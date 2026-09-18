import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Layers,
  Server,
  Users,
  Clock,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronRight,
  Menu,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser, activeView, setCurrentView, logout, deposits } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pendingDepositsCount = deposits.filter(d => d.status === 'pending').length;

  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'Overview Metrics', icon: LayoutDashboard },
    {
      id: 'admin-deposits',
      label: 'Deposit Approvals',
      icon: Wallet,
      badge: pendingDepositsCount > 0 ? `${pendingDepositsCount} PENDING` : undefined,
      badgeColor: 'amber'
    },
    { id: 'admin-orders', label: 'Master Orders Queue', icon: Receipt },
    { id: 'admin-services', label: 'Services & Pricing', icon: Layers },
    { id: 'admin-providers', label: 'Upstream API Providers', icon: Server },
    { id: 'admin-users', label: 'User & Balance Control', icon: Users },
    { id: 'admin-cron', label: 'Cron & Worker Queues', icon: Clock },
    { id: 'admin-settings', label: 'Platform & Hostinger', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-purple-900/30 bg-slate-950/95 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {/* Admin Header Badge */}
        <div className="p-4 border-b border-purple-900/30 bg-purple-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-600/25 border border-purple-400/30">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white truncate">Super Admin</p>
                <span className="text-[9px] font-mono px-1 rounded bg-purple-500/20 text-purple-300 font-bold">ROOT</span>
              </div>
              <p className="text-[11px] text-purple-300/70 font-mono truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 flex-1">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-purple-600/25 text-purple-200 font-semibold border border-purple-500/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    item.badgeColor === 'amber'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Portal Switch & Logout */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 rounded-xl transition"
          >
            <span>Switch to Client Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 min-w-0 pb-16">
        {/* Mobile menu bar */}
        <div className="lg:hidden p-3 border-b border-purple-900/30 bg-purple-950/30 flex items-center justify-between">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-purple-200 px-3 py-1.5 rounded-lg bg-slate-900 border border-purple-800"
          >
            <Menu className="w-4 h-4" />
            <span>Admin Navigation</span>
          </button>

          {pendingDepositsCount > 0 && (
            <span
              onClick={() => setCurrentView('admin-deposits')}
              className="text-xs font-mono font-bold text-amber-400 cursor-pointer bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30"
            >
              {pendingDepositsCount} UPI PENDING
            </span>
          )}
        </div>

        {mobileSidebarOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-1">
            {adminMenuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setCurrentView(item.id); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs ${
                    activeView === item.id ? 'bg-purple-600/20 text-purple-300 font-bold' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && <span className="text-[10px] text-amber-400">{item.badge}</span>}
                </button>
              );
            })}
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
