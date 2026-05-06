'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface ScoreHistoryChartProps {
  data: { date: string; score: number; lessonTitle: string }[];
}

export default function ScoreHistoryChart({ data }: ScoreHistoryChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';
  const primaryColor = 'hsl(var(--primary))';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';

  return (
    <div className="p-6 bg-card rounded-2xl border border-border shadow-sm">
      <h3 className="text-lg font-bold text-foreground mb-6">Quiz Score History</h3>
      <div className="h-[300px]">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis domain={[0, 100]} tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '12px',
                  color: tooltipText,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value) => [`${value}%`, 'Score']}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke={primaryColor}
                strokeWidth={3}
                dot={{ fill: primaryColor, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: primaryColor, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
