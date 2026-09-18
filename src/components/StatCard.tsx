import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'indigo' | 'emerald' | 'blue' | 'purple' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  color = 'indigo'
}) => {
  const colorMap = {
    indigo: 'from-indigo-500/10 to-indigo-500/5 text-indigo-400 border-indigo-500/20 group-hover:border-indigo-500/40',
    emerald: 'from-emerald-500/10 to-emerald-500/5 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/40',
    blue: 'from-blue-500/10 to-blue-500/5 text-blue-400 border-blue-500/20 group-hover:border-blue-500/40',
    purple: 'from-purple-500/10 to-purple-500/5 text-purple-400 border-purple-500/20 group-hover:border-purple-500/40',
    amber: 'from-amber-500/10 to-amber-500/5 text-amber-400 border-amber-500/20 group-hover:border-amber-500/40',
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-900/60 p-5 border border-slate-800/80 shadow-sm transition-all duration-200 hover:border-slate-700/80 hover:bg-slate-900/80">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{title}</span>
        <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-sans">{value}</span>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};
