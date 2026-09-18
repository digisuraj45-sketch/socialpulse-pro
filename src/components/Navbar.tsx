import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Layers,
  FileCode,
  BookOpen,
  DollarSign,
  User,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Server,
  Wallet as WalletIcon,
  ChevronDown,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    activeView,
    setCurrentView,
    loginAs,
    logout,
    userWallet,
    formatCurrency,
    currencies,
    activeCurrency,
    setActiveCurrency,
    resetToDemoData
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'api-docs', label: 'API v2' },
    { id: 'blog', label: 'Insights' },
    { id: 'contact', label: 'Contact' },
    { id: 'hostinger-hub', label: 'Hostinger & Laravel 13 Hub', badge: 'Docs & Code' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-purple-950/70 to-slate-950 border-b border-indigo-900/30 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3 h-3 mr-1 inline" /> V2 ENGINE LIVE
            </span>
            <span className="hidden sm:inline text-slate-300">
              Automated SMM Routing, Instant UPI / Cards & Hostinger Web/Cloud Deployment Architecture
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-800/90 hover:bg-slate-700/90 text-[11px] font-medium text-slate-200 border border-slate-700 transition"
              >
                <span>Role:</span>
                <strong className="text-indigo-300">
                  {currentUser ? (currentUser.role === 'admin' ? 'Super Admin' : 'Customer') : 'Visitor'}
                </strong>
                <ChevronDown className="w-3 h-3" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50 animate-in fade-in">
                  <button
                    onClick={() => { loginAs('customer'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-indigo-400" /> Customer Panel (Demo)
                  </button>
                  <button
                    onClick={() => { loginAs('admin'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-purple-600/20 hover:text-purple-300 flex items-center gap-2"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Super Admin Panel
                  </button>
                  <div className="border-t border-slate-800 my-1" />
                  <button
                    onClick={() => { resetToDemoData(); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/10 flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reset Demo Data
                  </button>
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/90 hover:bg-slate-700/90 text-[11px] font-semibold text-slate-200 border border-slate-700"
              >
                <span>{activeCurrency.code}</span>
                <span className="text-indigo-400">{activeCurrency.symbol}</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-32 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50">
                  {currencies.map(c => (
                    <button
                      key={c.code}
                      onClick={() => { setActiveCurrency(c.code); setCurrencyDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                        activeCurrency.code === c.code ? 'bg-indigo-600/30 text-indigo-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-slate-400 font-mono">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">SOCIALPULSE</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black tracking-widest uppercase bg-indigo-500 text-white">PRO</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide -mt-0.5 hidden sm:block">Smart Marketing Management Platform</p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => setCurrentView(link.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 ${
                activeView === link.id
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              {link.label}
              {link.badge && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Account Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              {currentUser.role === 'customer' && userWallet && (
                <div
                  onClick={() => setCurrentView('add-funds')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition cursor-pointer"
                  title="Click to Add Funds"
                >
                  <WalletIcon className="w-4 h-4 text-emerald-400" />
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-medium">Balance</p>
                    <p className="text-xs font-bold text-emerald-400 font-mono leading-none">
                      {formatCurrency(userWallet.balance)}
                    </p>
                  </div>
                </div>
              )}

              {currentUser.role === 'customer' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('new-order')}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" /> New Order
                  </button>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                  >
                    Dashboard
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCurrentView('admin-dashboard')}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> Admin Console
                </button>
              )}

              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => loginAs('customer')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition"
              >
                Login
              </button>
              <button
                onClick={() => setCurrentView('register')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          {currentUser && currentUser.role === 'customer' && userWallet && (
            <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
              {formatCurrency(userWallet.balance)}
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => { setCurrentView(link.id); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                activeView === link.id ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span>{link.label}</span>
              {link.badge && <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/50 text-purple-300">{link.badge}</span>}
            </button>
          ))}

          <div className="border-t border-slate-800 pt-3 space-y-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => { setCurrentView(currentUser.role === 'admin' ? 'admin-dashboard' : 'dashboard'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-sm font-bold text-center block"
                >
                  {currentUser.role === 'admin' ? 'Open Admin Console' : 'Go to User Dashboard'}
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-2 px-4 rounded-xl bg-slate-900 text-rose-400 text-sm font-semibold text-center block border border-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { loginAs('customer'); setMobileMenuOpen(false); }}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 text-slate-200 text-sm font-bold border border-slate-800"
                >
                  Login (Demo)
                </button>
                <button
                  onClick={() => { setCurrentView('register'); setMobileMenuOpen(false); }}
                  className="py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-sm font-bold"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
