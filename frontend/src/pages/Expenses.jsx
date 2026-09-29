import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { expenseService } from '../services/expenseService';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseCard from '../components/ExpenseCard';
import ExpenseForm from '../components/ExpenseForm';
import ConfirmationModal from '../components/ConfirmationModal';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { SpinnerLoader } from '../components/Loader';
import { formatINR } from '../utils/formatters';
import {
  Search,
  Filter,
  PlusCircle,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Calendar,
  CreditCard
} from 'lucide-react';

const PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest', label: 'Highest Amount' },
  { value: 'lowest', label: 'Lowest Amount' }
];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modals state
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load categories once
  useEffect(() => {
    async function loadCats() {
      try {
        const res = await expenseService.getCategories();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCats();
  }, []);

  // Fetch expenses with active filters
  const fetchExpenses = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page,
        limit: 10,
        sort: sortBy
      };

      if (search.trim()) params.search = search.trim();
      if (categoryFilter) params.category = categoryFilter;
      if (paymentFilter) params.paymentMethod = paymentFilter;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;
      if (minAmount) params.minAmount = minAmount;
      if (maxAmount) params.maxAmount = maxAmount;

      const res = await expenseService.getExpenses(params);
      if (res.success) {
        setExpenses(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
      setError('Failed to load expenses list. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, paymentFilter, fromDate, toDate, minAmount, maxAmount, sortBy]);

  useEffect(() => {
    fetchExpenses(1);
  }, [fetchExpenses]);

  const handlePageChange = (newPage) => {
    fetchExpenses(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setPaymentFilter('');
    setFromDate('');
    setToDate('');
    setMinAmount('');
    setMaxAmount('');
    setSortBy('newest');
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExpense) return;
    setDeleteLoading(true);
    try {
      await expenseService.deleteExpense(deletingExpense.id);
      setDeletingExpense(null);
      fetchExpenses(pagination.page);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete expense');
    } finally {
      setDeleteLoading(false);
    }
  };

  const hasActiveFilters =
    search || categoryFilter || paymentFilter || fromDate || toDate || minAmount || maxAmount || sortBy !== 'newest';

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div className="expenses-top-header">
        <div>
          <h1 className="page-main-title">Expense History</h1>
          <p className="page-main-sub">
            Search, filter, edit, and keep track of every rupee spent
          </p>
        </div>

        <Link to="/add-expense" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Add Expense</span>
        </Link>
      </div>

      {error && (
        <div className="badge badge-danger" style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Search & Filters Bar */}
      <div className="card filters-container">
        {/* Top search & quick filter row */}
        <div className="filters-main-row">
          {/* Search Input */}
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search expenses by title or note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="btn-icon btn-ghost clear-search-btn"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="filter-select-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-select filter-select"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="filter-select-wrap">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select filter-select"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle More Filters */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`btn btn-secondary filter-toggle-btn ${showAdvancedFilters ? 'active' : ''}`}
            title="More filter options"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
        </div>

        {/* Collapsible Advanced Filters Row */}
        {showAdvancedFilters && (
          <div className="filters-advanced-row animate-fade-in">
            {/* Payment Method */}
            <div className="filter-field">
              <label className="field-label">Payment Method</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="form-select"
              >
                <option value="">All Methods</option>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range: From */}
            <div className="filter-field">
              <label className="field-label">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Date Range: To */}
            <div className="filter-field">
              <label className="field-label">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Min Amount */}
            <div className="filter-field">
              <label className="field-label">Min Amount (₹)</label>
              <input
                type="number"
                placeholder="₹0"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="form-input"
                min="0"
              />
            </div>

            {/* Max Amount */}
            <div className="filter-field">
              <label className="field-label">Max Amount (₹)</label>
              <input
                type="number"
                placeholder="₹10,000"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="form-input"
                min="0"
              />
            </div>
          </div>
        )}

        {/* Active Filters Reset Bar */}
        {hasActiveFilters && (
          <div className="filters-active-bar">
            <span className="results-count-text">
              Showing {expenses.length} of {pagination.total} transaction{pagination.total === 1 ? '' : 's'}
            </span>
            <button
              onClick={handleResetFilters}
              className="btn btn-ghost btn-sm reset-filters-btn"
            >
              <X size={14} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Expenses Content */}
      <div className="card expenses-table-card">
        {loading ? (
          <SpinnerLoader message="Loading expenses..." />
        ) : expenses.length === 0 ? (
          <EmptyState
            icon={hasActiveFilters ? '🔍' : '🛍️'}
            title={hasActiveFilters ? 'No matching expenses found' : 'No expenses logged yet'}
            message={
              hasActiveFilters
                ? 'Try adjusting your search terms or clearing your filters.'
                : 'Start tracking your spending by adding your first daily expense!'
            }
            actionText={hasActiveFilters ? 'Reset Filters' : 'Add First Expense'}
            actionTo={hasActiveFilters ? null : '/add-expense'}
            onActionClick={hasActiveFilters ? handleResetFilters : null}
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="desktop-only">
              <ExpenseTable
                expenses={expenses}
                onEdit={(exp) => setEditingExpense(exp)}
                onDelete={(exp) => setDeletingExpense(exp)}
                showActions={true}
              />
            </div>

            {/* Mobile Cards View */}
            <div className="mobile-only expenses-cards-mobile">
              {expenses.map((exp) => (
                <ExpenseCard
                  key={exp.id}
                  expense={exp}
                  onEdit={(item) => setEditingExpense(item)}
                  onDelete={(item) => setDeletingExpense(item)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Edit Expense Modal */}
      {editingExpense && (
        <div className="modal-overlay" onClick={() => setEditingExpense(null)} role="dialog">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="modal-title">Edit Expense</h3>
              <button
                onClick={() => setEditingExpense(null)}
                className="btn-icon btn-ghost"
                aria-label="Close edit modal"
              >
                <X size={18} />
              </button>
            </div>

            <ExpenseForm
              initialData={editingExpense}
              isModal={true}
              onCancel={() => setEditingExpense(null)}
              onSubmitSuccess={() => {
                setEditingExpense(null);
                fetchExpenses(pagination.page);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingExpense}
        title="Delete Expense?"
        message={`Are you sure you want to permanently delete "${deletingExpense?.title}" for ${formatINR(deletingExpense?.amount || 0)}?`}
        confirmText="Delete Expense"
        isDanger={true}
        isLoading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingExpense(null)}
      />

      <style>{`
        .expenses-top-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .page-main-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .page-main-sub {
          font-size: 0.92rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .filters-container {
          margin-bottom: 1.5rem;
          padding: 1.25rem;
        }

        .filters-main-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .search-input-wrap {
          flex: 1;
          min-width: 240px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.65rem 2.2rem 0.65rem 2.5rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-surface);
          color: var(--text-primary);
          outline: none;
          font-size: 0.9rem;
        }

        .search-input:focus {
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .clear-search-btn {
          position: absolute;
          right: 0.5rem;
          padding: 0.25rem;
        }

        .filter-select-wrap {
          min-width: 160px;
        }

        .filter-select {
          padding: 0.65rem 0.85rem;
          font-size: 0.875rem;
        }

        .filter-toggle-btn.active {
          background: var(--primary-50);
          color: var(--primary-600);
          border-color: var(--primary-500);
        }

        .filters-advanced-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 0.85rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
        }

        .filter-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .field-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .filters-active-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.85rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.82rem;
        }

        .results-count-text {
          color: var(--text-muted);
          font-weight: 500;
        }

        .reset-filters-btn {
          color: var(--primary-500);
          font-weight: 600;
        }

        .expenses-table-card {
          padding: 0;
          overflow: hidden;
        }

        .expenses-cards-mobile {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .modal-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .mobile-only {
          display: none;
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
