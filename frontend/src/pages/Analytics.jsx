import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import CategoryChart from '../components/CategoryChart';
import ExpenseChart from '../components/ExpenseChart';
import MonthlyBarChart from '../components/MonthlyBarChart';
import CategoryComparisonChart from '../components/CategoryComparisonChart';
import { SpinnerLoader } from '../components/Loader';
import { formatINR } from '../utils/formatters';
import {
  PieChart as PieIcon,
  LineChart as LineIcon,
  BarChart3,
  Calendar,
  CreditCard,
  Flame,
  Award
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Analytics() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [analytics, setAnalytics] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError('');
        const [aRes, sRes] = await Promise.all([
          dashboardService.getAnalytics(selectedMonth, selectedYear),
          dashboardService.getSummary(selectedMonth, selectedYear)
        ]);

        if (aRes.success) setAnalytics(aRes.data);
        if (sRes.success) setSummary(sRes.data);
      } catch (err) {
        console.error('Analytics load error:', err);
        setError('Failed to fetch analytics datasets. Please refresh.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div className="page-wrapper animate-fade-in">
        <SpinnerLoader message="Compiling graphical analytics..." />
      </div>
    );
  }

  const highestCat = summary?.metrics?.highestSpendingCategory;
  const largestExp = summary?.metrics?.largestExpense;

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header with Month/Year Switcher */}
      <div className="analytics-header">
        <div>
          <h1 className="page-title">Spending Analytics & Charts</h1>
          <p className="page-subtitle">
            Visual breakdown of your habits, daily trends, and monthly comparisons
          </p>
        </div>

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

      {error && (
        <div className="badge badge-danger" style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Top Highlights Banner */}
      <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
        <div className="card highlight-card">
          <div className="highlight-icon-wrap" style={{ background: 'rgba(236, 72, 153, 0.12)', color: '#ec4899' }}>
            <Flame size={20} />
          </div>
          <div>
            <span className="highlight-label">Highest Category</span>
            <div className="highlight-title">
              {highestCat ? `${highestCat.icon} ${highestCat.name}` : 'None yet'}
            </div>
            <span className="highlight-sub">
              {highestCat ? `${formatINR(highestCat.amount)} (${highestCat.percentage}%)` : 'No expenses logged'}
            </span>
          </div>
        </div>

        <div className="card highlight-card">
          <div className="highlight-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
            <Award size={20} />
          </div>
          <div>
            <span className="highlight-label">Largest Single Expense</span>
            <div className="highlight-title">
              {largestExp ? largestExp.title : 'None yet'}
            </div>
            <span className="highlight-sub">
              {largestExp ? `${formatINR(largestExp.amount)} (${largestExp.categoryName})` : 'No expenses logged'}
            </span>
          </div>
        </div>

        <div className="card highlight-card">
          <div className="highlight-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <span className="highlight-label">Total Outflow</span>
            <div className="highlight-title">
              {formatINR(analytics?.totalSpent || 0)}
            </div>
            <span className="highlight-sub">
              Across {summary?.metrics?.transactionCount || 0} transactions
            </span>
          </div>
        </div>
      </div>

      {/* Row 1: Donut Chart & Daily Line Chart */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        {/* Chart 1: Category Donut */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <PieIcon size={18} color="#6366f1" />
              <h3 className="card-title">Category Spending Distribution</h3>
            </div>
            <span className="badge badge-info">Donut Chart</span>
          </div>
          <CategoryChart data={analytics?.categoryDonut || []} />
        </div>

        {/* Chart 2: Daily Line */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <LineIcon size={18} color="#6366f1" />
              <h3 className="card-title">Daily Spending Trend</h3>
            </div>
            <span className="badge badge-info">Line Chart</span>
          </div>
          <ExpenseChart data={analytics?.dailySpending || []} />
        </div>
      </div>

      {/* Row 2: Monthly Comparison Bar Chart & Category Comparison Bar Chart */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        {/* Chart 3: Monthly Trend */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BarChart3 size={18} color="#6366f1" />
              <h3 className="card-title">Monthly Spending Trend</h3>
            </div>
            <span className="badge badge-info">Last 6 Months</span>
          </div>
          <MonthlyBarChart data={analytics?.monthlyTrend || []} />
        </div>

        {/* Chart 4: Category Comparison */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BarChart3 size={18} color="#ec4899" />
              <h3 className="card-title">Category Breakdown Comparison</h3>
            </div>
            <span className="badge badge-info">Amounts</span>
          </div>
          <CategoryComparisonChart data={analytics?.categoryComparison || []} />
        </div>
      </div>

      {/* Row 3: Payment Method Breakdown */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CreditCard size={18} color="#6366f1" />
            <h3 className="card-title">Payment Method Share</h3>
          </div>
          <span className="card-subtitle">Cash vs UPI vs Debit Card</span>
        </div>

        <div className="payment-methods-grid">
          {(analytics?.paymentMethods || []).map((method) => (
            <div key={method.name} className="payment-method-card">
              <div className="method-top">
                <span className="method-name">{method.name}</span>
                <span className="method-pct">{method.percentage}%</span>
              </div>
              <div className="method-amount">{formatINR(method.amount)}</div>
              <div className="progress-bar-container" style={{ height: '6px', margin: '0.5rem 0 0 0' }}>
                <div
                  className="progress-bar-fill progress-normal"
                  style={{ width: `${method.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .analytics-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.75rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .highlight-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
        }

        .highlight-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .highlight-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        .highlight-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .highlight-sub {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .payment-methods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .payment-method-card {
          background: var(--bg-card-hover);
          padding: 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .method-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.35rem;
        }

        .method-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .method-pct {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .method-amount {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--primary-500);
        }
      `}</style>
    </div>
  );
}
