import React from 'react';
import { formatINR, formatDate } from '../utils/formatters';
import { Edit2, Trash2 } from 'lucide-react';

export default function ExpenseTable({ expenses = [], onEdit, onDelete, showActions = true }) {
  return (
    <div className="table-responsive-container">
      <table className="expenses-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title & Details</th>
            <th>Category</th>
            <th>Payment</th>
            <th className="text-right">Amount</th>
            {showActions && <th className="text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => {
            const category = expense.categories || {};
            const catColor = category.color || '#6366f1';
            const catIcon = category.icon || '📦';
            const catName = category.name || 'Other';

            return (
              <tr key={expense.id} className="expense-table-row">
                <td className="expense-date-cell">
                  <span className="date-main">{formatDate(expense.expense_date)}</span>
                </td>

                <td className="expense-title-cell">
                  <div className="title-bold">{expense.title}</div>
                  {expense.description && (
                    <div className="desc-muted">{expense.description}</div>
                  )}
                </td>

                <td className="expense-category-cell">
                  <span
                    className="cat-pill"
                    style={{
                      backgroundColor: `${catColor}15`,
                      color: catColor,
                      borderColor: `${catColor}35`
                    }}
                  >
                    <span>{catIcon}</span>
                    <span>{catName}</span>
                  </span>
                </td>

                <td className="expense-method-cell">
                  <span className="badge badge-info">{expense.payment_method}</span>
                </td>

                <td className="expense-amount-cell text-right">
                  <span className="amount-bold">{formatINR(expense.amount)}</span>
                </td>

                {showActions && (
                  <td className="expense-actions-cell text-center">
                    <div className="table-actions-group">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(expense)}
                          className="btn-icon btn-ghost table-action-btn"
                          title="Edit Expense"
                          aria-label={`Edit ${expense.title}`}
                        >
                          <Edit2 size={15} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(expense)}
                          className="btn-icon btn-ghost table-action-btn delete-btn"
                          title="Delete Expense"
                          aria-label={`Delete ${expense.title}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <style>{`
        .table-responsive-container {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .expenses-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          text-align: left;
        }

        .expenses-table th {
          background: var(--bg-card-hover);
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.85rem 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .expenses-table th:first-child {
          border-top-left-radius: var(--radius-md);
        }

        .expenses-table th:last-child {
          border-top-right-radius: var(--radius-md);
        }

        .expense-table-row {
          transition: background var(--transition-fast);
        }

        .expense-table-row:hover {
          background-color: var(--bg-card-hover);
        }

        .expenses-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          font-size: 0.875rem;
          vertical-align: middle;
        }

        .date-main {
          font-size: 0.82rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .title-bold {
          font-weight: 700;
          color: var(--text-primary);
        }

        .desc-muted {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
          max-width: 280px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          border: 1px solid transparent;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .amount-bold {
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .text-right {
          text-align: right;
        }

        .text-center {
          text-align: center;
        }

        .table-actions-group {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .table-action-btn {
          color: var(--text-muted);
          padding: 0.4rem;
        }

        .table-action-btn:hover {
          color: var(--primary-500);
        }

        .table-action-btn.delete-btn:hover {
          color: var(--danger);
        }
      `}</style>
    </div>
  );
}
