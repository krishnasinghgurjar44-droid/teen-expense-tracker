import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { formatINR } from '../utils/formatters';

export default function CategoryComparisonChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty-placeholder">
        <p>No category comparison data available.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="custom-chart-tooltip">
          <span className="tooltip-cat">
            {item.icon} {item.category}
          </span>
          <span className="tooltip-amount">{formatINR(item.amount)}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" opacity={0.6} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            tickFormatter={(val) => `₹${val}`}
          />
          <YAxis
            type="category"
            dataKey="category"
            tickLine={false}
            axisLine={{ stroke: 'var(--border-color)' }}
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            width={75}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={22}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill || '#6366f1'} />
            ))}
          </Bar>
        </BarChart>
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

        .tooltip-cat {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .tooltip-amount {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--primary-500);
        }
      `}</style>
    </div>
  );
}
