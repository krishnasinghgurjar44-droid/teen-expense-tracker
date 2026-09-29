import React from 'react';
import { Link } from 'react-router-dom';
import { formatINR } from '../utils/formatters';
import { PiggyBank, ArrowRight, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function BudgetCard({
  budget = 0,
  spent = 0,
  remaining = 0,
  percentage = 0,
  status = 'normal',
  monthName = 'This Month',
  year = new Date().getFullYear()
}) {
  const isBudgetSet = budget > 0;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  // Determine styling class & message based on percentage
  let progressClass = 'progress-normal';
  let badgeType = 'success';
  let friendlyNote = "You're spending comfortably within your budget.";

  if (!isBudgetSet) {
    friendlyNote = 'No monthly budget set yet. Setting a budget helps you keep track of your spending target!';
    badgeType = 'info';
  } else if (percentage > 100) {
    progressClass = 'progress-exceeded';
    badgeType = 'danger';
    friendlyNote = "You've crossed your planned budget for this month. Take a moment to review upcoming expenses.";
  } else if (percentage >= 90) {
    progressClass = 'progress-alert';
    badgeType = 'warning';
    friendlyNote = "You're getting close to your monthly budget. Consider checking your recent non-essential spending.";
  } else if (percentage >= 70) {
    progressClass = 'progress-caution';
    badgeType = 'warning';
    friendlyNote = "You've used over 70% of your budget. Pacing yourself will keep you comfortable for the rest of the month.";
  }

  return (
    <div className="card budget-card-container">
      <div className="budget-card-header">
        <div className="budget-title-wrap">
          <div className="budget-badge-icon">
            <PiggyBank size={20} color="#6366f1" />
          </div>
          <div>
            <h3 className="card-title">Monthly Budget Progress</h3>
            <span className="card-subtitle">{monthName} {year}</span>
          </div>
        </div>

        <Link to="/budget" className="btn btn-secondary btn-sm" title="Manage Monthly Budget">
          <span>Manage</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="budget-card-body">
        {/* Main Ratio Numbers */}
        <div className="budget-ratio-row">
          <div className="budget-ratio-left">
            <span className="budget-spent-label">Total Spent</span>
            <span className="budget-spent-amount">{formatINR(spent)}</span>
          </div>

          <div className="budget-ratio-divider">/</div>

          <div className="budget-ratio-right">
            <span className="budget-target-label">Budget</span>
            <span className="budget-target-amount">
              {isBudgetSet ? formatINR(budget) : 'Not Set'}
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="progress-bar-container" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
          <div
            className={`progress-bar-fill ${progressClass}`}
            style={{ width: `${isBudgetSet ? clampedPercentage : 0}%` }}
          />
        </div>

        {/* Progress Bar Footer info */}
        <div className="budget-metric-footer">
          <span className="metric-percentage">
            {isBudgetSet ? `${percentage}% utilized` : '0% utilized'}
          </span>
          <span className="metric-remaining">
            {isBudgetSet
              ? percentage > 100
                ? `${formatINR(spent - budget)} over budget`
                : `${formatINR(remaining)} remaining`
              : 'Set a budget to see remaining'}
          </span>
        </div>

        {/* Friendly Tip Box */}
        <div className={`budget-friendly-callout callout-${badgeType}`}>
          <div className="callout-icon">
            {percentage > 100 ? (
              <AlertTriangle size={18} />
            ) : percentage >= 70 ? (
              <Info size={18} />
            ) : (
              <CheckCircle size={18} />
            )}
          </div>
          <p className="callout-text">{friendlyNote}</p>
        </div>
      </div>

      <style>{`
        .budget-card-container {
          background: var(--bg-card);
        }

        .budget-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .budget-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .budget-badge-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: rgba(99, 102, 241, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .budget-ratio-row {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .budget-spent-label, .budget-target-label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .budget-spent-amount {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .budget-ratio-divider {
          font-size: 1.5rem;
          color: var(--text-muted);
          font-weight: 300;
        }

        .budget-target-amount {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .budget-metric-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .metric-percentage {
          color: var(--text-secondary);
        }

        .metric-remaining {
          color: var(--primary-500);
        }

        .budget-friendly-callout {
          margin-top: 1.25rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .callout-icon {
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .callout-success {
          background: var(--success-bg);
          color: var(--success);
          border: 1px solid var(--success-border);
        }

        .callout-warning {
          background: var(--warning-bg);
          color: #b45309;
          border: 1px solid var(--warning-border);
        }

        [data-theme='dark'] .callout-warning {
          color: #fbbf24;
        }

        .callout-danger {
          background: var(--danger-bg);
          color: var(--danger);
          border: 1px solid var(--danger-border);
        }

        .callout-info {
          background: var(--info-bg);
          color: var(--info);
          border: 1px solid var(--info-border);
        }

        .callout-text {
          color: inherit;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
