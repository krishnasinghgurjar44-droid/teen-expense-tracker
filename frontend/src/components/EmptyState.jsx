import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export default function EmptyState({
  icon = '💸',
  title = 'No expenses yet',
  message = 'Start tracking your spending to understand where your money goes.',
  actionText = 'Add Your First Expense',
  actionTo = '/add-expense',
  onActionClick = null
}) {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{message}</p>

      {actionText && (
        actionTo ? (
          <Link to={actionTo} className="btn btn-primary empty-state-btn">
            <PlusCircle size={17} />
            <span>{actionText}</span>
          </Link>
        ) : (
          <button onClick={onActionClick} className="btn btn-primary empty-state-btn">
            <PlusCircle size={17} />
            <span>{actionText}</span>
          </button>
        )
      )}

      <style>{`
        .empty-state-card {
          padding: 3.5rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bg-card);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-xl);
          margin: 1rem 0;
        }

        .empty-state-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          line-height: 1;
        }

        .empty-state-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .empty-state-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          max-width: 400px;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .empty-state-btn {
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
        }
      `}</style>
    </div>
  );
}
