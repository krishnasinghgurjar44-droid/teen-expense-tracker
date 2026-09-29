import React, { useState, useEffect } from 'react';
import { budgetService } from '../services/budgetService';
import BudgetCard from '../components/BudgetCard';
import { SpinnerLoader } from '../components/Loader';
import { formatINR } from '../utils/formatters';
import {
  PiggyBank,
  Check,
  Calendar,
  History,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Budget() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [budgetData, setBudgetData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inputAmount, setInputAmount] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Load budget and history
  const loadBudgetDetails = async (m, y) => {
    try {
      setLoading(true);
      const [bRes, hRes] = await Promise.all([
        budgetService.getBudget(m, y),
        budgetService.getHistory()
      ]);

      if (bRes.success) {
        setBudgetData(bRes.data);
        setInputAmount(bRes.data.budget > 0 ? String(bRes.data.budget) : '');
      }

      if (hRes.success) {
        setHistory(hRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load budget:', err);
      setFeedback({ type: 'danger', message: 'Could not load budget information.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgetDetails(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    const num = parseFloat(inputAmount);
    if (!inputAmount || isNaN(num) || num <= 0) {
      setFeedback({ type: 'danger', message: 'Please enter a valid budget amount greater than ₹0.' });
      return;
    }

    setSaving(true);
    try {
      const res = await budgetService.setBudget({
        month: selectedMonth,
        year: selectedYear,
        amount: num
      });

      if (res.success) {
        setBudgetData(res.data);
        setFeedback({ type: 'success', message: 'Monthly budget updated successfully! 🎯' });
        // Refresh history
        const hRes = await budgetService.getHistory();
        if (hRes.success) setHistory(hRes.data || []);
      }
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to save budget.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Page Header */}
      <div className="budget-top-header">
        <div>
          <h1 className="page-title">Monthly Budget Planner</h1>
          <p className="page-subtitle">
            Set your pocket money allowance target and keep non-essentials in check
          </p>
        </div>

        {/* Month Selector */}
        <div className="period-selector">
          <Calendar size={16} color="var(--text-muted)" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="period-select"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx + 1}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="period-select"
          >
            {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <SpinnerLoader message="Loading budget planner..." />
      ) : (
        <>
          {/* Main Grid: Set Budget Form + Active Budget Progress Card */}
          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            {/* Set / Update Form Card */}
            <div className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div className="budget-badge-icon">
                    <PiggyBank size={20} color="#6366f1" />
                  </div>
                  <div>
                    <h3 className="card-title">Set Monthly Limit</h3>
                    <p className="card-subtitle">
                      Target for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                    </p>
                  </div>
                </div>
              </div>

              {feedback.message && (
                <div
                  className={`badge badge-${feedback.type}`}
                  style={{ width: '100%', padding: '0.75rem', marginBottom: '1.25rem' }}
                >
                  {feedback.message}
                </div>
              )}

              <form onSubmit={handleSaveBudget}>
                <div className="form-group">
                  <label className="form-label" htmlFor="budget-amount">
                    Monthly Budget (INR ₹) *
                  </label>
                  <div className="input-with-prefix">
                    <span className="input-currency-prefix">₹</span>
                    <input
                      id="budget-amount"
                      type="number"
                      step="any"
                      min="100"
                      placeholder="e.g. 8000"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      className="form-input has-prefix"
                      disabled={saving}
                      required
                    />
                  </div>
                  <p className="form-hint">
                    Recommended starter budget for students: ₹5,000 – ₹10,000 per month
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  disabled={saving}
                >
                  {saving ? 'Saving Target...' : 'Save Monthly Budget'}
                </button>
              </form>

              {/* Quick Preset Buttons */}
              <div className="quick-presets">
                <span className="preset-label">Quick Presets:</span>
                <div className="preset-buttons">
                  {[3000, 5000, 8000, 10000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setInputAmount(String(amt))}
                      className="btn btn-secondary btn-sm"
                    >
                      {formatINR(amt)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Progress Card */}
            <div>
              <BudgetCard
                budget={budgetData?.budget || 0}
                spent={budgetData?.spent || 0}
                remaining={budgetData?.remaining || 0}
                percentage={budgetData?.percentage || 0}
                status={budgetData?.status || 'normal'}
                monthName={MONTH_NAMES[selectedMonth - 1]}
                year={selectedYear}
              />

              {/* 50-30-20 Rule Card for Teenagers */}
              <div className="card rule-card" style={{ marginTop: '1.25rem' }}>
                <div className="rule-header">
                  <Sparkles size={16} color="#6366f1" />
                  <h4 className="rule-title">Teenager 50-30-20 Guide</h4>
                </div>
                <div className="rule-splits">
                  <div className="split-item">
                    <span className="split-pct">50%</span>
                    <span className="split-name">Needs</span>
                    <span className="split-ex">Bus, meals, books</span>
                  </div>
                  <div className="split-item">
                    <span className="split-pct">30%</span>
                    <span className="split-name">Wants</span>
                    <span className="split-ex">Hangouts, games, fashion</span>
                  </div>
                  <div className="split-item">
                    <span className="split-pct">20%</span>
                    <span className="split-name">Savings</span>
                    <span className="split-ex">Emergency fund, goals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Budgets Record */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <History size={18} color="#6366f1" />
                <h3 className="card-title">Budget History</h3>
              </div>
              <span className="card-subtitle">Previous months track record</span>
            </div>

            {history.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem 0' }}>
                No past months recorded yet. Your monthly track record will appear here.
              </p>
            ) : (
              <div className="table-responsive-container">
                <table className="expenses-table">
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th>Target Budget</th>
                      <th>Actual Spent</th>
                      <th>Remaining</th>
                      <th>Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 700 }}>
                          {MONTH_NAMES[item.month - 1]} {item.year}
                        </td>
                        <td>{formatINR(item.budget)}</td>
                        <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {formatINR(item.spent)}
                        </td>
                        <td style={{ color: item.remaining >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                          {formatINR(item.remaining)}
                        </td>
                        <td>
                          <span
                            className={`badge badge-${
                              item.percentage > 100
                                ? 'danger'
                                : item.percentage >= 80
                                ? 'warning'
                                : 'success'
                            }`}
                          >
                            {item.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        .budget-top-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.75rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .period-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-md);
        }

        .period-select {
          border: none;
          background: none;
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-primary);
          outline: none;
          cursor: pointer;
        }

        .quick-presets {
          margin-top: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .preset-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .preset-buttons {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .rule-card {
          background: var(--primary-gradient-subtle);
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: 1.25rem;
        }

        .rule-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .rule-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary-500);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .rule-splits {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          text-align: center;
        }

        .split-item {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          padding: 0.65rem 0.4rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .split-pct {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--primary-500);
        }

        .split-name {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .split-ex {
          font-size: 0.68rem;
          color: var(--text-muted);
          line-height: 1.2;
        }
      `}</style>
    </div>
  );
}
