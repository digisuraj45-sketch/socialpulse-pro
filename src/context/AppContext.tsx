/**
 * SOCIALPULSE PRO - Application Context & State Engine
 * Manages full lifecycle: Wallet transactions, Order calculation, Provider synchronization,
 * Multi-currency converter, Role switching, and Hostinger compatibility simulation.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Wallet,
  WalletTransaction,
  ServiceCategory,
  Service,
  Provider,
  Order,
  OrderStatus,
  Deposit,
  SupportTicket,
  ApiKey,
  KycSubmission,
  ChildPanel,
  AuditLog,
  Currency,
  Coupon,
  PaymentMethod
} from '../types';
import {
  INITIAL_CURRENCIES,
  INITIAL_USERS,
  INITIAL_WALLETS,
  INITIAL_CATEGORIES,
  INITIAL_PROVIDERS,
  INITIAL_SERVICES,
  INITIAL_ORDERS,
  INITIAL_TRANSACTIONS,
  INITIAL_DEPOSITS,
  INITIAL_TICKETS,
  INITIAL_API_KEYS,
  INITIAL_CHILD_PANELS,
  INITIAL_AUDIT_LOGS,
  INITIAL_COUPONS
} from '../data/seedData';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation & Auth
  currentUser: User | null;
  activeView: string;
  setCurrentView: (view: string) => void;
  loginAs: (role: 'customer' | 'admin') => void;
  logout: () => void;

  // Data Collections
  users: User[];
  wallets: Record<string, Wallet>;
  userWallet: Wallet | null;
  categories: ServiceCategory[];
  services: Service[];
  providers: Provider[];
  orders: Order[];
  transactions: WalletTransaction[];
  deposits: Deposit[];
  tickets: SupportTicket[];
  apiKeys: ApiKey[];
  kycSubmissions: KycSubmission[];
  childPanels: ChildPanel[];
  auditLogs: AuditLog[];
  coupons: Coupon[];

  // Currency
  currencies: Currency[];
  activeCurrency: Currency;
  setActiveCurrency: (code: string) => void;
  formatCurrency: (usdAmount: number) => string;
  convertFromUsd: (usdAmount: number) => number;
  convertToUsd: (amountInActiveCurrency: number) => number;

  // Actions
  placeOrder: (data: {
    serviceId: string;
    link: string;
    quantity: number;
    customData?: any;
  }) => { success: boolean; error?: string; orderId?: string };
  
  requestRefill: (orderId: string) => { success: boolean; message: string };
  requestCancel: (orderId: string) => { success: boolean; message: string };

  submitDeposit: (data: {
    gateway: PaymentMethod;
    amount: number;
    transactionRef: string;
    paymentProof?: string;
    couponCode?: string;
  }) => { success: boolean; message: string };

  adminApproveDeposit: (depositId: string) => void;
  adminRejectDeposit: (depositId: string, reason?: string) => void;
  adminAdjustWallet: (userId: string, amount: number, type: 'credit' | 'debit', reason: string) => void;
  adminUpdateOrderStatus: (orderId: string, status: OrderStatus, refundQty?: number) => void;
  adminSyncProviders: () => { syncedCount: number; message: string };
  adminAddService: (newService: Omit<Service, 'id'>) => void;
  adminToggleServiceStatus: (serviceId: string) => void;

  createSupportTicket: (subject: string, department: any, priority: any, message: string) => void;
  replySupportTicket: (ticketId: string, message: string, isAdmin?: boolean) => void;
  closeSupportTicket: (ticketId: string) => void;

  generateApiKey: (name: string) => ApiKey;
  revokeApiKey: (keyId: string) => void;
  submitKyc: (documentType: any, documentNumber: string) => void;
  adminReviewKyc: (kycId: string, status: 'approved' | 'rejected') => void;
  createChildPanel: (name: string, domain: string, markup: number) => void;

  // Toasts
  toasts: Toast[];
  addToast: (type: Toast['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Reset
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or seedData
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('spp_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS[1]; // Default logged in as demo customer 'digisuraj'
  });

  const [activeView, setActiveView] = useState<string>('home');

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('spp_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [wallets, setWallets] = useState<Record<string, Wallet>>(() => {
    const saved = localStorage.getItem('spp_wallets');
    return saved ? JSON.parse(saved) : INITIAL_WALLETS;
  });

  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    const saved = localStorage.getItem('spp_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('spp_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [providers, setProviders] = useState<Provider[]>(() => {
    const saved = localStorage.getItem('spp_providers');
    return saved ? JSON.parse(saved) : INITIAL_PROVIDERS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('spp_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('spp_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [deposits, setDeposits] = useState<Deposit[]>(() => {
    const saved = localStorage.getItem('spp_deposits');
    return saved ? JSON.parse(saved) : INITIAL_DEPOSITS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('spp_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() => {
    const saved = localStorage.getItem('spp_api_keys');
    return saved ? JSON.parse(saved) : INITIAL_API_KEYS;
  });

  const [kycSubmissions, setKycSubmissions] = useState<KycSubmission[]>([
    {
      id: 'kyc_1',
      user_id: 'usr_demo',
      user_name: 'Suraj Sharma',
      user_email: 'digisuraj45@gmail.com',
      document_type: 'Aadhaar Card',
      document_number: 'XXXX-XXXX-8921',
      status: 'approved',
      submitted_at: '2026-01-20T10:00:00Z',
      reviewed_at: '2026-01-20T11:30:00Z',
    }
  ]);

  const [childPanels, setChildPanels] = useState<ChildPanel[]>(() => {
    const saved = localStorage.getItem('spp_child_panels');
    return saved ? JSON.parse(saved) : INITIAL_CHILD_PANELS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('spp_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [currencies] = useState<Currency[]>(INITIAL_CURRENCIES);
  const [activeCurrency, setActiveCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('spp_active_currency');
    if (saved) {
      const found = INITIAL_CURRENCIES.find(c => c.code === saved);
      if (found) return found;
    }
    return INITIAL_CURRENCIES[1]; // Default INR for India-friendly feel, or toggleable to USD
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('spp_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('spp_wallets', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem('spp_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('spp_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('spp_deposits', JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem('spp_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Active user's wallet
  const userWallet = currentUser ? wallets[currentUser.id] || null : null;

  // Currency helpers
  const setActiveCurrency = (code: string) => {
    const found = currencies.find(c => c.code === code);
    if (found) {
      setActiveCurrencyState(found);
      localStorage.setItem('spp_active_currency', code);
      addToast('info', 'Currency Updated', `Display currency switched to ${found.code} (${found.symbol})`);
    }
  };

  const convertFromUsd = (usdAmount: number): number => {
    return Number((usdAmount * activeCurrency.rate_to_usd).toFixed(2));
  };

  const convertToUsd = (amountInActiveCurrency: number): number => {
    return Number((amountInActiveCurrency / activeCurrency.rate_to_usd).toFixed(2));
  };

  const formatCurrency = (usdAmount: number): string => {
    const converted = convertFromUsd(usdAmount);
    if (activeCurrency.code === 'INR') {
      return `₹${converted.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${activeCurrency.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Toast notifications
  const addToast = (type: Toast['type'], title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth switching
  const loginAs = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      const adminUser = users.find(u => u.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(adminUser);
      setActiveView('admin-dashboard');
      addToast('success', 'Admin Session Active', `Logged in as ${adminUser.name} with root administrative privileges.`);
    } else {
      const customer = users.find(u => u.role === 'customer') || INITIAL_USERS[1];
      setCurrentUser(customer);
      setActiveView('dashboard');
      addToast('success', 'Welcome Back', `Logged in to client portal as ${customer.name}.`);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('home');
    addToast('info', 'Signed Out', 'You have been safely signed out of SocialPulse Pro.');
  };

  // PLACE ORDER (Full mathematical & financial execution)
  const placeOrder = (data: {
    serviceId: string;
    link: string;
    quantity: number;
    customData?: any;
  }) => {
    if (!currentUser) {
      addToast('error', 'Authentication Required', 'Please sign in to place an order.');
      return { success: false, error: 'Not authenticated' };
    }

    const service = services.find(s => s.id === data.serviceId);
    if (!service) {
      addToast('error', 'Invalid Service', 'Selected service does not exist or is inactive.');
      return { success: false, error: 'Service not found' };
    }

    if (data.quantity < service.min_quantity || data.quantity > service.max_quantity) {
      const err = `Quantity must be between ${service.min_quantity.toLocaleString()} and ${service.max_quantity.toLocaleString()}.`;
      addToast('error', 'Invalid Quantity', err);
      return { success: false, error: err };
    }

    if (!data.link.trim()) {
      addToast('error', 'Missing Target Link', 'Target account or post URL is required.');
      return { success: false, error: 'Target URL is required' };
    }

    // Precise financial calculation: (quantity / 1000) * selling_rate
    const charge = Number(((data.quantity / 1000) * service.selling_rate).toFixed(4));
    const providerCharge = Number(((data.quantity / 1000) * service.provider_rate).toFixed(4));
    const profit = Number((charge - providerCharge).toFixed(4));

    const currentWallet = wallets[currentUser.id] || {
      id: `wal_${currentUser.id}`,
      user_id: currentUser.id,
      currency: 'USD',
      balance: 0,
      total_spent: 0,
      total_deposited: 0,
      updated_at: new Date().toISOString()
    };

    if (currentWallet.balance < charge) {
      const needed = (charge - currentWallet.balance).toFixed(2);
      addToast('error', 'Insufficient Wallet Balance', `Order cost is ${formatCurrency(charge)}. You need ${formatCurrency(Number(needed))} more in your wallet.`);
      return { success: false, error: 'Insufficient funds' };
    }

    // Perform atomic balance deduction
    const balanceBefore = currentWallet.balance;
    const balanceAfter = Number((balanceBefore - charge).toFixed(4));

    const updatedWallet: Wallet = {
      ...currentWallet,
      balance: balanceAfter,
      total_spent: Number((currentWallet.total_spent + charge).toFixed(4)),
      updated_at: new Date().toISOString(),
    };

    const orderId = `ord_${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: orderId,
      user_id: currentUser.id,
      service_id: service.id,
      service_name: service.name,
      category_name: categories.find(c => c.id === service.category_id)?.name || 'General',
      provider_id: service.provider_id,
      provider_order_id: `EXT-${Math.floor(100000 + Math.random() * 900000)}`,
      link: data.link.trim(),
      quantity: data.quantity,
      charge,
      provider_charge: providerCharge,
      profit,
      start_count: Math.floor(Math.random() * 500) + 100,
      remains: data.quantity,
      status: 'pending',
      custom_data: data.customData,
      refill_status: service.refill_enabled ? 'eligible' : 'none',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      user_id: currentUser.id,
      wallet_id: currentWallet.id,
      type: 'order_debit',
      amount: charge,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      reference_type: 'order',
      reference_id: orderId,
      description: `Order #${orderId}: ${service.name} (Qty: ${data.quantity.toLocaleString()})`,
      status: 'completed',
      created_at: new Date().toISOString(),
    };

    // Update state
    setWallets(prev => ({ ...prev, [currentUser.id]: updatedWallet }));
    setOrders(prev => [newOrder, ...prev]);
    setTransactions(prev => [newTx, ...prev]);

    // Dispatch celebratory confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) { /* ignore */ }

    addToast('success', 'Order Dispatched!', `Order #${orderId} was registered and queued for automatic provider fulfillment.`);

    // Simulate asynchronous provider queue transition after 4 seconds
    setTimeout(() => {
      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return { ...o, status: 'processing', updated_at: new Date().toISOString() };
        }
        return o;
      }));
    }, 4000);

    return { success: true, orderId };
  };

  // REFILL REQUEST
  const requestRefill = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    if (order.refill_status === 'requested') {
      return { success: false, message: 'A refill request is already pending for this order.' };
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          refill_status: 'requested',
          refill_id: `rfl_${Date.now()}`,
          updated_at: new Date().toISOString()
        };
      }
      return o;
    }));

    addToast('success', 'Refill Triggered', `Refill task dispatched to upstream provider for Order #${orderId}.`);
    return { success: true, message: 'Refill requested successfully.' };
  };

  // CANCEL REQUEST
  const requestCancel = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    if (order.status !== 'pending' && order.status !== 'processing') {
      return { success: false, message: 'Only pending or processing orders can be requested for cancellation.' };
    }

    // Automatically trigger cancellation and refund
    adminUpdateOrderStatus(orderId, 'cancelled');
    addToast('info', 'Order Cancelled', `Order #${orderId} was cancelled and ${formatCurrency(order.charge)} has been refunded to your wallet.`);
    return { success: true, message: 'Order cancelled and funds refunded.' };
  };

  // DEPOSIT (Add Funds)
  const submitDeposit = (data: {
    gateway: PaymentMethod;
    amount: number; // in USD
    transactionRef: string;
    paymentProof?: string;
    couponCode?: string;
  }) => {
    if (!currentUser) return { success: false, message: 'Authentication required' };

    const depositId = `dep_${Math.floor(1000 + Math.random() * 9000)}`;
    const fee = data.gateway === 'stripe' ? Number((data.amount * 0.03).toFixed(2)) : 0;
    let finalAmount = data.amount;

    // Check bonus coupon
    if (data.couponCode) {
      const coupon = coupons.find(c => c.code.toUpperCase() === data.couponCode?.toUpperCase() && c.status === 'active');
      if (coupon && coupon.bonus_deposit_percentage > 0) {
        const bonus = (data.amount * coupon.bonus_deposit_percentage) / 100;
        finalAmount += bonus;
      }
    }

    const isInstant = data.gateway === 'mock_instant' || data.gateway === 'razorpay' || data.gateway === 'stripe' || data.gateway === 'paypal';

    const newDeposit: Deposit = {
      id: depositId,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_email: currentUser.email,
      gateway: data.gateway,
      amount: data.amount,
      currency: 'USD',
      fee,
      final_amount: finalAmount,
      status: isInstant ? 'approved' : 'pending',
      transaction_ref: data.transactionRef || `REF-${Date.now().toString().slice(-8)}`,
      payment_proof: data.paymentProof || (data.gateway === 'upi_manual' ? 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&auto=format&fit=crop&q=80' : undefined),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDeposits(prev => [newDeposit, ...prev]);

    if (isInstant) {
      // Immediate credit
      const userWal = wallets[currentUser.id] || {
        id: `wal_${currentUser.id}`,
        user_id: currentUser.id,
        currency: 'USD',
        balance: 0,
        total_spent: 0,
        total_deposited: 0,
        updated_at: new Date().toISOString()
      };

      const balBefore = userWal.balance;
      const balAfter = Number((balBefore + finalAmount).toFixed(4));

      const updatedWal: Wallet = {
        ...userWal,
        balance: balAfter,
        total_deposited: Number((userWal.total_deposited + finalAmount).toFixed(4)),
        updated_at: new Date().toISOString()
      };

      const newTx: WalletTransaction = {
        id: `tx_${Date.now()}`,
        user_id: currentUser.id,
        wallet_id: userWal.id,
        type: 'deposit',
        amount: finalAmount,
        balance_before: balBefore,
        balance_after: balAfter,
        reference_type: 'deposit',
        reference_id: depositId,
        description: `Instant Deposit via ${data.gateway.replace('_', ' ').toUpperCase()} (Ref: ${newDeposit.transaction_ref})`,
        status: 'completed',
        created_at: new Date().toISOString(),
      };

      setWallets(prev => ({ ...prev, [currentUser.id]: updatedWal }));
      setTransactions(prev => [newTx, ...prev]);

      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch (e) { /* ignore */ }

      addToast('success', 'Funds Deposited!', `${formatCurrency(finalAmount)} was successfully credited to your wallet balance.`);
      return { success: true, message: 'Deposit successful and balance updated.' };
    } else {
      // Manual UPI submitted for admin verification
      addToast('info', 'Deposit Submitted', 'Your manual UPI transaction with UTR has been submitted to admin queue for instant verification.');
      return { success: true, message: 'Deposit submitted for approval.' };
    }
  };

  // ADMIN APPROVE DEPOSIT
  const adminApproveDeposit = (depositId: string) => {
    const dep = deposits.find(d => d.id === depositId);
    if (!dep || dep.status !== 'pending') return;

    const userWal = wallets[dep.user_id] || {
      id: `wal_${dep.user_id}`,
      user_id: dep.user_id,
      currency: 'USD',
      balance: 0,
      total_spent: 0,
      total_deposited: 0,
      updated_at: new Date().toISOString()
    };

    const balBefore = userWal.balance;
    const balAfter = Number((balBefore + dep.final_amount).toFixed(4));

    const updatedWal: Wallet = {
      ...userWal,
      balance: balAfter,
      total_deposited: Number((userWal.total_deposited + dep.final_amount).toFixed(4)),
      updated_at: new Date().toISOString()
    };

    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      user_id: dep.user_id,
      wallet_id: userWal.id,
      type: 'deposit',
      amount: dep.final_amount,
      balance_before: balBefore,
      balance_after: balAfter,
      reference_type: 'deposit',
      reference_id: depositId,
      description: `Approved Manual Deposit (Ref: ${dep.transaction_ref})`,
      status: 'completed',
      created_at: new Date().toISOString(),
    };

    setWallets(prev => ({ ...prev, [dep.user_id]: updatedWal }));
    setTransactions(prev => [newTx, ...prev]);
    setDeposits(prev => prev.map(d => d.id === depositId ? { ...d, status: 'approved', updated_at: new Date().toISOString() } : d));

    // Audit log
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      admin_name: currentUser?.name || 'Super Admin',
      action: 'DEPOSIT_APPROVED',
      subject: `Deposit #${depositId}`,
      details: `Approved ${formatCurrency(dep.final_amount)} for User ID: ${dep.user_id}`,
      ip_address: '103.41.22.91',
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    addToast('success', 'Deposit Approved', `Deposit #${depositId} for ${formatCurrency(dep.final_amount)} was approved and wallet credited.`);
  };

  // ADMIN REJECT DEPOSIT
  const adminRejectDeposit = (depositId: string, reason = 'Invalid UTR / Payment reference verification failed') => {
    setDeposits(prev => prev.map(d => d.id === depositId ? { ...d, status: 'rejected', admin_notes: reason, updated_at: new Date().toISOString() } : d));
    addToast('warning', 'Deposit Rejected', `Deposit #${depositId} marked rejected. Reason: ${reason}`);
  };

  // ADMIN MANUAL WALLET ADJUSTMENT
  const adminAdjustWallet = (userId: string, amount: number, type: 'credit' | 'debit', reason: string) => {
    const userWal = wallets[userId] || {
      id: `wal_${userId}`,
      user_id: userId,
      currency: 'USD',
      balance: 0,
      total_spent: 0,
      total_deposited: 0,
      updated_at: new Date().toISOString()
    };

    const balBefore = userWal.balance;
    let balAfter = balBefore;

    if (type === 'credit') {
      balAfter = Number((balBefore + amount).toFixed(4));
    } else {
      if (balBefore < amount) {
        addToast('error', 'Adjustment Error', 'Cannot debit more than current wallet balance.');
        return;
      }
      balAfter = Number((balBefore - amount).toFixed(4));
    }

    const updatedWal: Wallet = {
      ...userWal,
      balance: balAfter,
      updated_at: new Date().toISOString()
    };

    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      user_id: userId,
      wallet_id: userWal.id,
      type: type === 'credit' ? 'manual_credit' : 'manual_debit',
      amount,
      balance_before: balBefore,
      balance_after: balAfter,
      reference_type: 'admin_adjustment',
      reference_id: `adj_${Date.now()}`,
      description: `Admin Manual Adjustment: ${reason}`,
      status: 'completed',
      created_at: new Date().toISOString(),
    };

    setWallets(prev => ({ ...prev, [userId]: updatedWal }));
    setTransactions(prev => [newTx, ...prev]);

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      admin_name: currentUser?.name || 'Super Admin',
      action: type === 'credit' ? 'WALLET_MANUAL_CREDIT' : 'WALLET_MANUAL_DEBIT',
      subject: `User #${userId}`,
      details: `${type.toUpperCase()}: ${formatCurrency(amount)}. Reason: ${reason}`,
      ip_address: '103.41.22.91',
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    addToast('success', 'Wallet Adjusted', `Successfully applied manual ${type} of ${formatCurrency(amount)}.`);
  };

  // ADMIN UPDATE ORDER STATUS (with refund logic if cancelled or partial)
  const adminUpdateOrderStatus = (orderId: string, status: OrderStatus, refundQty?: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Check if cancellation requires full refund
    if (status === 'cancelled' && order.status !== 'cancelled' && order.status !== 'refunded') {
      const userWal = wallets[order.user_id];
      if (userWal) {
        const balBefore = userWal.balance;
        const balAfter = Number((balBefore + order.charge).toFixed(4));

        setWallets(prev => ({
          ...prev,
          [order.user_id]: {
            ...userWal,
            balance: balAfter,
            total_spent: Math.max(0, Number((userWal.total_spent - order.charge).toFixed(4))),
            updated_at: new Date().toISOString()
          }
        }));

        const newTx: WalletTransaction = {
          id: `tx_${Date.now()}`,
          user_id: order.user_id,
          wallet_id: userWal.id,
          type: 'refund',
          amount: order.charge,
          balance_before: balBefore,
          balance_after: balAfter,
          reference_type: 'refund',
          reference_id: order.id,
          description: `Full Refund for Cancelled Order #${order.id}`,
          status: 'completed',
          created_at: new Date().toISOString(),
        };

        setTransactions(prev => [newTx, ...prev]);
      }
    }

    // Check partial completion refund
    if (status === 'partial' && refundQty && refundQty > 0) {
      const unitRate = order.charge / order.quantity;
      const refundAmount = Number((refundQty * unitRate).toFixed(4));
      const userWal = wallets[order.user_id];

      if (userWal && refundAmount > 0) {
        const balBefore = userWal.balance;
        const balAfter = Number((balBefore + refundAmount).toFixed(4));

        setWallets(prev => ({
          ...prev,
          [order.user_id]: {
            ...userWal,
            balance: balAfter,
            total_spent: Math.max(0, Number((userWal.total_spent - refundAmount).toFixed(4))),
            updated_at: new Date().toISOString()
          }
        }));

        const newTx: WalletTransaction = {
          id: `tx_${Date.now()}`,
          user_id: order.user_id,
          wallet_id: userWal.id,
          type: 'refund',
          amount: refundAmount,
          balance_before: balBefore,
          balance_after: balAfter,
          reference_type: 'refund',
          reference_id: order.id,
          description: `Partial Refund for Order #${order.id} (${refundQty} units not delivered)`,
          status: 'completed',
          created_at: new Date().toISOString(),
        };

        setTransactions(prev => [newTx, ...prev]);
      }
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          remains: status === 'completed' ? 0 : (refundQty ? refundQty : o.remains),
          updated_at: new Date().toISOString()
        };
      }
      return o;
    }));

    addToast('info', 'Order Updated', `Order #${orderId} status set to ${status.toUpperCase()}.`);
  };

  // ADMIN SYNC PROVIDERS
  const adminSyncProviders = () => {
    // Simulate updating active processing orders
    let updatedCount = 0;
    setOrders(prev => prev.map(o => {
      if (o.status === 'processing' || o.status === 'in_progress') {
        updatedCount++;
        return {
          ...o,
          status: 'completed',
          remains: 0,
          updated_at: new Date().toISOString()
        };
      }
      return o;
    }));

    // Update provider balances
    setProviders(prev => prev.map(p => ({
      ...p,
      balance: Number((p.balance - 12.40).toFixed(2)),
      last_sync_at: new Date().toISOString()
    })));

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      admin_name: currentUser?.name || 'Super Admin',
      action: 'BATCH_PROVIDER_SYNC',
      subject: 'All Providers',
      details: `Synchronized order statuses across 3 providers. Transitioned ${updatedCount} orders to completed.`,
      ip_address: '103.41.22.91',
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    addToast('success', 'Provider Sync Completed', `Polled all provider APIs. Synchronized status for ${updatedCount} active orders.`);
    return { syncedCount: updatedCount, message: `Synchronized ${updatedCount} orders.` };
  };

  // ADMIN ADD SERVICE
  const adminAddService = (newService: Omit<Service, 'id'>) => {
    const newId = `srv_${Date.now().toString().slice(-4)}`;
    const created: Service = {
      ...newService,
      id: newId,
    };
    setServices(prev => [created, ...prev]);
    addToast('success', 'Service Created', `Service "${newService.name}" has been published.`);
  };

  const adminToggleServiceStatus = (serviceId: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        const nextStatus = s.status === 'active' ? 'inactive' : 'active';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
    addToast('info', 'Service Updated', 'Service status toggled.');
  };

  // SUPPORT TICKETS
  const createSupportTicket = (subject: string, department: any, priority: any, message: string) => {
    if (!currentUser) return;
    const ticketId = `tkt_${Math.floor(1000 + Math.random() * 9000)}`;
    const ticketNumber = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: SupportTicket = {
      id: ticketId,
      ticket_number: ticketNumber,
      user_id: currentUser.id,
      user_name: currentUser.name,
      subject,
      department,
      priority,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          ticket_id: ticketId,
          user_id: currentUser.id,
          user_name: currentUser.name,
          is_admin: false,
          message,
          created_at: new Date().toISOString(),
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    addToast('success', 'Ticket Dispatched', `Ticket ${ticketNumber} created. Our support team will answer shortly.`);
  };

  const replySupportTicket = (ticketId: string, message: string, isAdmin = false) => {
    if (!currentUser) return;

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newMessage = {
          id: `msg_${Date.now()}`,
          ticket_id: ticketId,
          user_id: currentUser.id,
          user_name: currentUser.name,
          is_admin: isAdmin,
          message,
          created_at: new Date().toISOString()
        };
        return {
          ...t,
          status: isAdmin ? 'answered' : 'customer_reply',
          updated_at: new Date().toISOString(),
          messages: [...t.messages, newMessage]
        };
      }
      return t;
    }));

    addToast('success', 'Message Sent', 'Your response has been appended to the ticket thread.');
  };

  const closeSupportTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'closed', updated_at: new Date().toISOString() } : t));
    addToast('info', 'Ticket Closed', 'Support ticket has been marked as resolved.');
  };

  // API KEYS
  const generateApiKey = (name: string): ApiKey => {
    if (!currentUser) throw new Error('Unauthenticated');
    const secretRandom = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const fullKey = `spp_live_${secretRandom}`;
    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      user_id: currentUser.id,
      name,
      key_prefix: fullKey.substring(0, 12),
      full_key: fullKey,
      status: 'active',
      last_used_at: null,
      created_at: new Date().toISOString()
    };
    setApiKeys(prev => [newKey, ...prev]);
    addToast('success', 'API Key Generated', 'Store your API secret safely. It grants access to your account wallet.');
    return newKey;
  };

  const revokeApiKey = (keyId: string) => {
    setApiKeys(prev => prev.map(k => k.id === keyId ? { ...k, status: 'revoked' } : k));
    addToast('warning', 'API Key Revoked', 'The selected API key is no longer authorized.');
  };

  // KYC
  const submitKyc = (documentType: any, documentNumber: string) => {
    if (!currentUser) return;
    const newKyc: KycSubmission = {
      id: `kyc_${Date.now()}`,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_email: currentUser.email,
      document_type: documentType,
      document_number: documentNumber,
      status: 'pending',
      submitted_at: new Date().toISOString()
    };
    setKycSubmissions(prev => [newKyc, ...prev]);
    addToast('info', 'KYC Submitted', 'Your verification documents are pending compliance review.');
  };

  const adminReviewKyc = (kycId: string, status: 'approved' | 'rejected') => {
    setKycSubmissions(prev => prev.map(k => {
      if (k.id === kycId) {
        return {
          ...k,
          status,
          reviewed_at: new Date().toISOString()
        };
      }
      return k;
    }));
    addToast('info', 'KYC Status Updated', `Submission marked ${status}.`);
  };

  // CHILD PANELS
  const createChildPanel = (name: string, domain: string, markup: number) => {
    if (!currentUser) return;
    const newCp: ChildPanel = {
      id: `cp_${Date.now()}`,
      name,
      domain,
      markup_percentage: markup,
      currency: 'USD',
      status: 'active',
      owner_user_id: currentUser.id,
      total_orders: 0,
      total_revenue: 0,
      created_at: new Date().toISOString()
    };
    setChildPanels(prev => [newCp, ...prev]);
    addToast('success', 'Child Panel Configured', `Domain ${domain} registered with ${markup}% automated profit markup.`);
  };

  // RESET
  const resetToDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setWallets(INITIAL_WALLETS);
    setCategories(INITIAL_CATEGORIES);
    setServices(INITIAL_SERVICES);
    setProviders(INITIAL_PROVIDERS);
    setOrders(INITIAL_ORDERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setDeposits(INITIAL_DEPOSITS);
    setTickets(INITIAL_TICKETS);
    setApiKeys(INITIAL_API_KEYS);
    setChildPanels(INITIAL_CHILD_PANELS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(INITIAL_USERS[1]);
    setActiveView('home');
    addToast('info', 'Demo Reset', 'All database records refreshed to pristine state.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeView,
        setCurrentView: setActiveView,
        loginAs,
        logout,
        users,
        wallets,
        userWallet,
        categories,
        services,
        providers,
        orders,
        transactions,
        deposits,
        tickets,
        apiKeys,
        kycSubmissions,
        childPanels,
        auditLogs,
        coupons,
        currencies,
        activeCurrency,
        setActiveCurrency,
        formatCurrency,
        convertFromUsd,
        convertToUsd,
        placeOrder,
        requestRefill,
        requestCancel,
        submitDeposit,
        adminApproveDeposit,
        adminRejectDeposit,
        adminAdjustWallet,
        adminUpdateOrderStatus,
        adminSyncProviders,
        adminAddService,
        adminToggleServiceStatus,
        createSupportTicket,
        replySupportTicket,
        closeSupportTicket,
        generateApiKey,
        revokeApiKey,
        submitKyc,
        adminReviewKyc,
        createChildPanel,
        toasts,
        addToast,
        removeToast,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
