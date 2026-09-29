import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import { ArrowLeft, Sparkles, PlusCircle } from 'lucide-react';

export default function AddExpense() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="add-expense-container">
        {/* Back Link */}
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>

        {/* Page Header */}
        <div className="add-header">
          <div className="add-icon-badge">
            <PlusCircle size={24} color="#6366f1" />
          </div>
          <div>
            <h1 className="page-title">Record an Expense</h1>
            <p className="page-subtitle">
              Every small rupee tracked brings you closer to your financial goals
            </p>
          </div>
        </div>

        {/* Form Container Card */}
        <div className="card add-form-card">
          <ExpenseForm
            onSubmitSuccess={() => {
              navigate('/dashboard');
            }}
          />
        </div>

        {/* Friendly Teen Financial Tips */}
        <div className="card add-tips-card">
          <div className="tips-top-row">
            <Sparkles size={18} color="#f59e0b" />
            <h4 className="tips-heading">Smart Spending Rule</h4>
          </div>
          <p className="tips-body">
            "Before spending on something you want, think: Will I still care about this purchase 2 weeks from now?"
          </p>
        </div>
      </div>

      <style>{`
        .add-expense-container {
          max-width: 640px;
          margin: 0 auto;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          transition: color var(--transition-fast);
        }

        .back-link:hover {
          color: var(--primary-500);
        }

        .add-header {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.75rem;
        }

        .add-icon-badge {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: rgba(99, 102, 241, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .page-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .page-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: 0.15rem;
        }

        .add-form-card {
          padding: 2rem;
          box-shadow: var(--shadow-md);
        }

        .add-tips-card {
          margin-top: 1.5rem;
          background: var(--primary-gradient-subtle);
          border: 1px dashed rgba(99, 102, 241, 0.3);
          padding: 1.25rem;
        }

        .tips-top-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
        }

        .tips-heading {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary-500);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .tips-body {
          font-size: 0.85rem;
          color: var(--text-primary);
          line-height: 1.45;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
