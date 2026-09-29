import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { formatINR } from '../utils/formatters';

const DEFAULT_COLORS = [
  '#f97316', '#06b6d4', '#3b82f6', '#ec4899', '#8b5cf6',
  '#eab308', '#10b981', '#14b8a6', '#64748b'
];

export default function CategoryChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="donut-empty-placeholder">
        <p>No category expenses to visualize yet.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="donut-tooltip">
          <div className="tooltip-cat-title">
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </div>
          <div className="tooltip-cat-value">{formatINR(item.amount)}</div>
          <div className="tooltip-cat-percent">{item.percentage}% of total</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="donut-container">
      <div className="donut-chart-box">
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={88}
              paddingAngle={4}
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                  stroke="var(--bg-surface)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Category Legend Breakdown */}
      <div className="donut-legend-list">
        {data.map((item, idx) => (
          <div key={item.name || idx} className="legend-row">
            <div className="legend-left">
              <span
                className="legend-dot"
                style={{ backgroundColor: item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length] }}
              />
              <span className="legend-icon">{item.icon}</span>
              <span className="legend-name">{item.name}</span>
            </div>
            <div className="legend-right">
              <span className="legend-amount">{formatINR(item.amount)}</span>
              <span className="legend-percentage">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .donut-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .donut-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
          }
        }

        .donut-chart-box {
          position: relative;
        }

        .donut-empty-placeholder {
          height: 230px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .donut-tooltip {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.65rem 0.85rem;
          box-shadow: var(--shadow-lg);
        }

        .tooltip-cat-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .tooltip-cat-value {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--primary-500);
          margin-top: 0.2rem;
        }

        .tooltip-cat-percent {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .donut-legend-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 230px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .legend-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.82rem;
          padding: 0.35rem 0;
          border-bottom: 1px solid var(--border-subtle);
        }

        .legend-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          flex-shrink: 0;
        }

        .legend-icon {
          font-size: 0.95rem;
        }

        .legend-name {
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .legend-right {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
        }

        .legend-amount {
          font-weight: 700;
          color: var(--text-primary);
        }

        .legend-percentage {
          font-size: 0.75rem;
          color: var(--text-muted);
          width: 32px;
          text-align: right;
        }
      `}</style>
    </div>
  );
}
