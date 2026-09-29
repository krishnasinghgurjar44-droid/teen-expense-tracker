import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import SummaryCard from '../components/SummaryCard';
import BudgetCard from '../components/BudgetCard';
import ExpenseChart from '../components/ExpenseChart';
import CategoryChart from '../components/CategoryChart';
import SpendingSuggestions from '../components/SpendingSuggestions';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseCard from '../components/ExpenseCard';
import EmptyState from '../components/EmptyState';
import { SkeletonCard, SpinnerLoader } from '../components/Loader';
import { formatINR, getGreeting } from '../utils/formatters';
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Calendar,
  Receipt,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [summaryRes, analyticsRes, recentRes, suggestionsRes] = await Promise.all([
        dashboardService.getSummary(currentMonth, currentYear),
        dashboardService.getAnalytics(currentMonth, currentYear),
        dashboardService.getRecent(6),
        dashboardService.getSuggestions(currentMonth, currentYear)
      ]);

      if (summaryRes.success) setSummary(summaryRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (recentRes.success) setRecentExpenses(recentRes.data);
      if (suggestionsRes.success) setSuggestions(suggestionsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to fetch latest dashboard statistics. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper animate-fade-in">
        <div style={{ marginBottom: '2rem' }}>
          <div className="skeleton" style={{ width: '250px', height: '36px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '180px', height: '18px' }} />
        </div>
        <SkeletonCard count={4} />
        <div style={{ marginTop: '2rem' }}>
          <SpinnerLoader message="Crunching your latest numbers..." />
        </div>
      </div>
    );
  }

  const budgetInfo = summary?.budget || {};
  const metrics = summary?.metrics || {};
  const comparison = summary?.comparison || {};
  const period = summary?.period || {};

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Dashboard Top Header */}
      <div className="dashboard-hero-header">
        <div>
          <h1 className="hero-greeting">
            {getGreeting()}, <span className="brand-gradient">{user?.name ? user.name.split(' ')[0] : 'there'}</span> 👋
          </h1>
          <p className="hero-subtext">
            Here's what happened with your money in {period.monthName || 'this month'} {period.year || currentYear}.
          </p>
        </div>

        <div className="hero-actions">
          <Link to="/add-expense" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Add Expense</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="badge badge-danger" style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Top Financial Summary Cards */}
      <div className="grid-4 summary-cards-grid">
        <SummaryCard
          title="Monthly Budget"
          value={budgetInfo.monthlyBudget > 0 ? formatINR(budgetInfo.monthlyBudget) : 'Not Set'}
          subtitle={budgetInfo.monthlyBudget > 0 ? `${period.monthName} Target` : 'Set a spending target'}
          icon={Wallet}
          color="indigo"
          badgeText={budgetInfo.monthlyBudget > 0 ? 'Active' : 'Unbudgeted'}
          badgeType={budgetInfo.monthlyBudget > 0 ? 'info' : 'neutral'}
        />

        <SummaryCard
          title="Total Spent"
          value={formatINR(budgetInfo.totalSpent || 0)}
          subtitle={
            comparison.percentageChange !== null
              ? `${Math.abs(comparison.percentageChange)}% ${comparison.trend === 'up' ? 'more than' : 'less than'} last month`
              : 'Recorded this month'
          }
          icon={TrendingDown}
          color="pink"
          badgeText={
            comparison.trend === 'up'
              ? '+ Up'
              : comparison.trend === 'down'
              ? '- Down'
              : 'Equal'
          }
          badgeType={comparison.trend === 'up' ? 'warning' : 'success'}
        />

        <SummaryCard
          title="Remaining Budget"
          value={formatINR(budgetInfo.remainingBudget || 0)}
          subtitle={
            budgetInfo.monthlyBudget > 0
              ? `${Math.max(0, 100 - (budgetInfo.budgetUsagePercentage || 0))}% left to spend`
              : 'Set a budget to track'
          }
          icon={PiggyBank}
          color="emerald"
          badgeText={budgetInfo.isExceeded ? 'Exceeded' : 'Safe'}
          badgeType={budgetInfo.isExceeded ? 'danger' : 'success'}
        />

        <SummaryCard
          title="Daily Average"
          value={formatINR(metrics.averageDailySpending || 0)}
          subtitle={`Across ${period.daysElapsed || 1} day${(period.daysElapsed || 1) > 1 ? 's' : ''} this month`}
          icon={Calendar}
          color="cyan"
          badgeText={`${metrics.transactionCount || 0} Txns`}
          badgeType="neutral"
        />
      </div>

      {/* Main Budget Progress Bar Section */}
      <div style={{ marginTop: '1.75rem' }}>
        <BudgetCard
          budget={budgetInfo.monthlyBudget || 0}
          spent={budgetInfo.totalSpent || 0}
          remaining={budgetInfo.remainingBudget || 0}
          percentage={budgetInfo.budgetUsagePercentage || 0}
          monthName={period.monthName}
          year={period.year}
        />
      </div>

      {/* Visual Analytics Charts Row */}
      <div className="grid-2 dashboard-charts-row" style={{ marginTop: '1.75rem' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Category Spending</h3>
              <p className="card-subtitle">Where your money went this month</p>
            </div>
            <Link to="/analytics" className="btn btn-ghost btn-sm" title="View full charts">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <CategoryChart data={analytics?.categoryDonut || []} />
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Daily Spending Flow</h3>
              <p className="card-subtitle">Spending patterns day by day</p>
            </div>
            <Link to="/analytics" className="btn btn-ghost btn-sm" title="View full charts">
              <span>Trend</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <ExpenseChart data={analytics?.dailySpending || []} />
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="card" style={{ marginTop: '1.75rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Receipt size={20} color="#6366f1" />
              <span>Recent Expenses</span>
            </h3>
            <p className="card-subtitle">Your latest logged purchases</p>
          </div>
          <Link to="/expenses" className="btn btn-secondary btn-sm">
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <EmptyState
            icon="🛍️"
            title="No expenses logged this month yet"
            message="Tap below to record your first snack, transport fare, or purchase!"
            actionText="Add Expense"
            actionTo="/add-expense"
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="desktop-only">
              <ExpenseTable expenses={recentExpenses} showActions={false} />
            </div>

            {/* Mobile Cards View */}
            <div className="mobile-only recent-cards-mobile">
              {recentExpenses.map((exp) => (
                <ExpenseCard key={exp.id} expense={exp} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Smart Suggestions */}
      <SpendingSuggestions suggestions={suggestions} />

      <style>{`
        .dashboard-hero-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.75rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-greeting {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .hero-subtext {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .summary-cards-grid {
          margin-bottom: 0.5rem;
        }

        .mobile-only {
          display: none;
        }

        .recent-cards-mobile {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        @media (max-width: 1023px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
