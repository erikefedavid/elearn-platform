'use client';

import { Zap } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  const getStreakLevel = () => {
    if (streak >= 30) return { label: 'Legendary', color: 'from-amber-400 to-orange-500', glow: 'shadow-lg shadow-amber-500/20', bgClass: 'bg-amber-500/10' };
    if (streak >= 14) return { label: 'On Fire', color: 'from-orange-400 to-red-500', glow: 'shadow-lg shadow-red-500/20', bgClass: 'bg-red-500/10' };
    if (streak >= 7) return { label: 'Consistent', color: 'from-primary to-purple-500', glow: 'shadow-lg shadow-primary/20', bgClass: 'bg-primary/10' };
    if (streak >= 3) return { label: 'Building Up', color: 'from-emerald-400 to-emerald-600', glow: 'shadow-sm', bgClass: 'bg-emerald-500/10' };
    return { label: 'Getting Started', color: 'from-muted-foreground to-muted-foreground/80', glow: '', bgClass: 'bg-muted' };
  };

  const level = getStreakLevel();

  return (
    <div className={`p-6 rounded-2xl ${level.bgClass} border border-border ${level.glow}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center animate-pulse-slow shrink-0`}>
          <Zap className="w-6 h-6 text-foreground" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{streak} days</p>
          <p className="text-sm text-muted-foreground">Learning Streak</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r ${level.color} text-white`}>
          🔥 {level.label}
        </span>
        <span className="text-xs text-muted-foreground">Keep it going!</span>
      </div>
    </div>
  );
}
