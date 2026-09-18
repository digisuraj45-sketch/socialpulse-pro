/**
 * SOCIALPULSE PRO - Core Type Definitions
 * Complete architectural type definitions for SMM & Digital Marketing Platform
 */

export type UserRole = 'customer' | 'admin' | 'manager' | 'support_agent' | 'finance_manager';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'banned' | 'unverified';
  email_verified_at: string | null;
  currency: string;
  timezone: string;
  two_factor_enabled: boolean;
  kyc_status: 'none' | 'pending' | 'approved' | 'rejected';
  referral_code: string;
  referred_by?: string;
  created_at: string;
  last_login_at?: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  currency: string;
  balance: number; // in base currency USD (or active preferred currency)
  total_spent: number;
  total_deposited: number;
  updated_at: string;
}

export type TransactionType = 
  | 'deposit'
  | 'order_debit'
  | 'refund'
  | 'referral_credit'
  | 'manual_credit'
  | 'manual_debit'
  | 'chargeback'
  | 'adjustment';

export interface WalletTransaction {
  id: string;
  user_id: string;
  wallet_id: string;
  type: TransactionType;
  amount: number;
  balance_before: number;
  balance_after: number;
  reference_type: 'order' | 'deposit' | 'referral' | 'admin_adjustment' | 'refund';
  reference_id: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  platform: 'Instagram' | 'YouTube' | 'TikTok' | 'Facebook' | 'Telegram' | 'X / Twitter' | 'LinkedIn' | 'Spotify' | 'Web Traffic' | 'SEO';
  icon: string;
  description: string;
  status: 'active' | 'inactive';
  sort_order: number;
}

export type ServiceType = 
  | 'default'
  | 'custom_comments'
  | 'comment_likes'
  | 'followers'
  | 'likes'
  | 'views'
  | 'shares'
  | 'traffic'
  | 'poll'
  | 'mentions'
  | 'keywords'
  | 'drip_feed';

export interface Service {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  service_type: ServiceType;
  provider_id: string;
  provider_service_id: string;
  provider_rate: number; // per 1000
  selling_rate: number;  // per 1000
  min_quantity: number;
  max_quantity: number;
  average_time: string;
  refill_enabled: boolean;
  refill_days?: number;
  cancel_enabled: boolean;
  status: 'active' | 'inactive';
  sort_order: number;
  requires_comments?: boolean;
  requires_keywords?: boolean;
  requires_usernames?: boolean;
  drip_feed_supported?: boolean;
}

export interface Provider {
  id: string;
  name: string;
  base_url: string;
  api_key_masked: string;
  currency: string;
  balance: number;
  status: 'active' | 'inactive';
  last_sync_at: string;
  timeout: number;
  type: 'mock' | 'standard_v2';
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'in_progress'
  | 'completed'
  | 'partial'
  | 'cancelled'
  | 'refunded'
  | 'failed';

export interface Order {
  id: string;
  user_id: string;
  service_id: string;
  service_name: string;
  category_name: string;
  provider_id: string;
  provider_order_id?: string;
  link: string;
  quantity: number;
  charge: number;
  provider_charge: number;
  profit: number;
  start_count: number;
  remains: number;
  status: OrderStatus;
  custom_data?: {
    comments?: string;
    usernames?: string;
    keywords?: string;
    runs?: number;
    interval?: number;
  };
  refill_status?: 'none' | 'eligible' | 'requested' | 'completed' | 'rejected';
  refill_id?: string;
  created_at: string;
  updated_at: string;
}

export interface RefillRequest {
  id: string;
  order_id: string;
  user_id: string;
  service_name: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  reason?: string;
  provider_refill_id?: string;
  created_at: string;
  updated_at: string;
}

export type PaymentMethod = 
  | 'upi_manual'
  | 'razorpay'
  | 'stripe'
  | 'paypal'
  | 'mock_instant';

export interface Deposit {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  gateway: PaymentMethod;
  amount: number;
  currency: string;
  fee: number;
  final_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'failed';
  transaction_ref: string;
  payment_proof?: string; // image url or preview
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  user_name: string;
  subject: string;
  department: 'Orders' | 'Payments' | 'Refill & Cancel' | 'API & Technical' | 'General Inquiry';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'answered' | 'customer_reply' | 'closed';
  created_at: string;
  updated_at: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  user_name: string;
  is_admin: boolean;
  message: string;
  attachment_url?: string;
  created_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  full_key?: string; // shown once
  status: 'active' | 'revoked';
  last_used_at: string | null;
  created_at: string;
}

export interface KycSubmission {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  document_type: 'Aadhaar Card' | 'Passport' | 'National ID' | 'Driving License';
  document_number: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export interface ChildPanel {
  id: string;
  name: string;
  domain: string;
  markup_percentage: number;
  currency: string;
  status: 'active' | 'suspended';
  owner_user_id: string;
  total_orders: number;
  total_revenue: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_name: string;
  action: string;
  subject: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate_to_usd: number; // 1 USD = X Currency
  is_default: boolean;
}

export interface Coupon {
  code: string;
  discount_percentage: number;
  bonus_deposit_percentage: number;
  min_amount: number;
  max_discount: number;
  status: 'active' | 'expired';
}
