'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'purple' | 'green' | 'blue' | 'amber' | 'red';
}

const colorMap = {
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', icon: 'bg-purple-500/20' },
  green: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: 'bg-emerald-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: 'bg-blue-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', icon: 'bg-amber-500/20' },
  red: { bg: 'bg-red-500/10', text: 'text-red-500', icon: 'bg-red-500/20' },
};

export default function ProgressCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'purple',
}: ProgressCardProps) {
  const colors = colorMap[color];
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className={`p-6 rounded-2xl ${colors.bg} border border-border shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-3xl font-bold ${colors.text} mt-2`}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colors.icon}`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>
      {trend && trendValue && (
        <div className="flex items-center gap-1 mt-4">
          <TrendIcon className={`w-4 h-4 ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`} />
          <span className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}
