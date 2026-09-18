import React from 'react';
import { OrderStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus | 'pending' | 'approved' | 'rejected' | 'completed' | 'active' | 'inactive' | 'open' | 'answered' | 'customer_reply' | 'closed';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let label = status.replace('_', ' ');

  switch (normalized) {
    case 'completed':
    case 'approved':
    case 'active':
      colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      break;
    case 'in_progress':
    case 'processing':
    case 'answered':
      colorClasses = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      break;
    case 'pending':
    case 'customer_reply':
    case 'open':
      colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      break;
    case 'partial':
      colorClasses = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      break;
    case 'cancelled':
    case 'rejected':
    case 'failed':
    case 'closed':
    case 'inactive':
      colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      break;
    case 'refunded':
      colorClasses = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      break;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border tracking-wide uppercase font-mono ${sizeClasses} ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
};
