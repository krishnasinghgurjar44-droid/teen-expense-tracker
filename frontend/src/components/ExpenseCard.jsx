import React from 'react';
import { formatINR, formatDate } from '../utils/formatters';
import { Edit2, Trash2 } from 'lucide-react';

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const category = expense.categories || {};
  const catColor = category.color || '#6366f1';
  const catIcon = category.icon || '📦';
  const catName = category.name || 'Other';

  return (
    <div className="expense-mobile-card">
      <div className="card-top-row">
        <div className="cat-badge-wrap" style={{ backgroundColor: `${catColor}20`, borderColor: `${catColor}40` }}>
          <span className="cat-icon">{catIcon}</span>
        </div>

        <div className="title-section">
          <h4 className="expense-title-text">{expense.title}</h4>
          <span className="expense-date-sub">{formatDate(expense.expense_date)}</span>
        </div>

        <div className="amount-section">
          <span className="expense-amount-val">{formatINR(expense.amount)}</span>
        </div>
      </div>

      {expense.description && (
        <p className="expense-desc-text">{expense.description}</p>
      )}

      <div className="card-bottom-row">
        <div className="badges-group">
          <span className="badge badge-neutral" style={{ borderColor: `${catColor}50` }}>
            {catName}
          </span>
          <span className="badge badge-info">
            {expense.payment_method}
          </span>
        </div>

        <div className="actions-group">
          {onEdit && (
            <button
              onClick={() => onEdit(expense)}
              className="btn-icon btn-ghost action-btn"
              title="Edit Expense"
              aria-label={`Edit ${expense.title}`}
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(expense)}
              className="btn-icon btn-ghost action-btn delete-action"
              title="Delete Expense"
              aria-label={`Delete ${expense.title}`}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        .expense-mobile-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1rem;
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }

        .expense-mobile-card:hover {
          border-color: var(--primary-500);
          box-shadow: var(--shadow-md);
        }

        .card-top-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .cat-badge-wrap {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .title-section {
          flex: 1;
          min-width: 0;
        }

        .expense-title-text {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .expense-date-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: block;
        }

        .amount-section {
          text-align: right;
        }

        .expense-amount-val {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .expense-desc-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-top: 0.5rem;
          line-height: 1.35;
        }

        .card-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.75rem;
          padding-top: 0.65rem;
          border-top: 1px solid var(--border-subtle);
        }

        .badges-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .actions-group {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .action-btn {
          color: var(--text-muted);
          padding: 0.35rem;
        }

        .action-btn:hover {
          color: var(--primary-500);
        }

        .delete-action:hover {
          color: var(--danger);
        }
      `}</style>
    </div>
  );
}
