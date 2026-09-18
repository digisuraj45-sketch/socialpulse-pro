import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Layers,
  ListOrdered,
  RefreshCw,
  Wallet,
  Receipt,
  Code,
  Users,
  LifeBuoy,
  FileCheck,
  Shield,
  User as UserIcon,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface UserLayoutProps {
  children: React.ReactNode;
}

export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const { currentUser, activeView, setCurrentView, logout, userWallet, formatCurrency } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-order', label: 'New Order', icon: Layers, highlight: true },
    { id: 'user-services', label: 'Services Catalog', icon: ListOrdered },
    { id: 'orders', label: 'Orders Log', icon: Receipt },
    { id: 'refills', label: 'Refill Center', icon: RefreshCw },
    { id: 'add-funds', label: 'Add Funds (Wallet)', icon: Wallet, badge: 'UPI / Cards' },
    { id: 'transactions', label: 'Transactions Ledger', icon: Receipt },
    { id: 'api-keys', label: 'API v2 Tokens', icon: Code },
    { id: 'referrals', label: 'Affiliate & Referrals', icon: Users },
    { id: 'support', label: 'Support Tickets', icon: LifeBuoy },
    { id: 'kyc', label: 'KYC Verification', icon: FileCheck },
    { id: 'security', label: 'Security & 2FA', icon: Shield },
    { id: 'profile', label: 'Account Profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800/80 bg-slate-950/95 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {/* User mini badge */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
              <p className="text-[11px] text-slate-400 font-mono truncate">@{currentUser?.username}</p>
            </div>
          </div>

          {userWallet && (
            <div
              onClick={() => setCurrentView('add-funds')}
              className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Wallet Balance</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {formatCurrency(userWallet.balance)}
                </span>
              </div>
              <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                + Top Up
              </span>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                } ${item.highlight ? 'text-indigo-400 font-bold' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom logout */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Workstation</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 pb-16">
        {/* Mobile menu bar */}
        <div className="lg:hidden p-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            <Menu className="w-4 h-4" />
            <span>Customer Menu</span>
          </button>

          {userWallet && (
            <span
              onClick={() => setCurrentView('add-funds')}
              className="text-xs font-mono font-bold text-emerald-400 cursor-pointer"
            >
              {formatCurrency(userWallet.balance)}
            </span>
          )}
        </div>

        {mobileSidebarOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setCurrentView(item.id); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs ${
                    activeView === item.id ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && <span className="text-[10px] text-slate-400">{item.badge}</span>}
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
