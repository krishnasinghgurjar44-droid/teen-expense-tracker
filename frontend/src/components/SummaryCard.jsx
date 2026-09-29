import React from 'react';

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = 'neutral',
  color = 'indigo'
}) {
  const colorMap = {
    indigo: {
      bg: 'rgba(99, 102, 241, 0.12)',
      text: '#6366f1'
    },
    emerald: {
      bg: 'rgba(16, 185, 129, 0.12)',
      text: '#10b981'
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.12)',
      text: '#f59e0b'
    },
    pink: {
      bg: 'rgba(236, 72, 153, 0.12)',
      text: '#ec4899'
    },
    cyan: {
      bg: 'rgba(6, 182, 212, 0.12)',
      text: '#06b6d4'
    }
  };

  const activeColor = colorMap[color] || colorMap.indigo;

  return (
    <div className="card summary-card">
      <div className="summary-header">
        <span className="summary-title">{title}</span>
        <div
          className="summary-icon-wrap"
          style={{ backgroundColor: activeColor.bg, color: activeColor.text }}
        >
          {Icon ? React.createElement(Icon, { size: 20 }) : <span>💰</span>}
        </div>
      </div>

      <div className="summary-body">
        <div className="summary-value">{value}</div>
        <div className="summary-footer">
          {subtitle && <span className="summary-subtitle">{subtitle}</span>}
          {badgeText && (
            <span className={`badge badge-${badgeType}`}>{badgeText}</span>
          )}
        </div>
      </div>

      <style>{`
        .summary-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .summary-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .summary-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .summary-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .summary-value {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }

        .summary-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .summary-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
