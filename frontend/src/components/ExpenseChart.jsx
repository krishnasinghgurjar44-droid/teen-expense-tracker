import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { formatINR } from '../utils/formatters';

export default function ExpenseChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty-placeholder">
        <p>No daily spending recorded yet for this month.</p>
      </div>
    );
  }

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="custom-chart-tooltip">
          <span className="tooltip-date">{item.label || label}</span>
          <span className="tooltip-amount">{formatINR(payload[0].value)}</span>
          {item.count > 0 && (
            <span className="tooltip-count">{item.count} transaction{item.count > 1 ? 's' : ''}</span>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.6} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={{ stroke: 'var(--border-color)' }}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            tickFormatter={(val) => `₹${val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="url(#lineGlow)"
            strokeWidth={3}
            dot={{ r: 3, fill: '#6366f1', strokeWidth: 1, stroke: '#ffffff' }}
            activeDot={{ r: 6, fill: '#ec4899', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <style>{`
        .chart-wrapper {
          width: 100%;
          min-height: 260px;
        }

        .chart-empty-placeholder {
          height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .custom-chart-tooltip {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.65rem 0.85rem;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .tooltip-date {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .tooltip-amount {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--primary-500);
        }

        .tooltip-count {
          font-size: 0.72rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
