import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { Loader2, PlusCircle, Check } from 'lucide-react';

const PAYMENT_METHODS = ['UPI', 'Cash', 'Debit Card', 'Other'];

export default function ExpenseForm({
  initialData = null,
  onSubmitSuccess,
  onCancel,
  isModal = false
}) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category_id: '',
    expense_date: new Date().toISOString().split('T')[0],
    payment_method: 'UPI',
    description: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await expenseService.getCategories();
        if (res.success && res.data) {
          setCategories(res.data);
          if (!initialData && res.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              category_id: prev.category_id || res.data[0].id
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, [initialData]);

  // Populate data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount !== undefined ? String(initialData.amount) : '',
        category_id: initialData.category_id || (initialData.categories ? initialData.categories.id : ''),
        expense_date: initialData.expense_date
          ? initialData.expense_date.split('T')[0]
          : new Date().toISOString().split('T')[0],
        payment_method: initialData.payment_method || 'UPI',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required.';
    } else if (formData.title.length > 150) {
      errors.title = 'Title must be 150 characters or less.';
    }

    const numAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      errors.amount = 'Please enter a valid amount greater than ₹0.';
    }

    if (!formData.category_id) {
      errors.category_id = 'Please select a category.';
    }

    if (!formData.expense_date) {
      errors.expense_date = 'Date is required.';
    }

    if (!formData.payment_method) {
      errors.payment_method = 'Please select a payment method.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      let result;
      if (initialData && initialData.id) {
        result = await expenseService.updateExpense(initialData.id, formData);
        setSuccessMessage('Expense updated successfully! ✨');
      } else {
        result = await expenseService.createExpense(formData);
        setSuccessMessage('Expense recorded successfully! 🎉');
        // Reset form for new entry if not modal
        if (!isModal) {
          setFormData({
            title: '',
            amount: '',
            category_id: categories.length > 0 ? categories[0].id : '',
            expense_date: new Date().toISOString().split('T')[0],
            payment_method: 'UPI',
            description: ''
          });
        }
      }

      if (onSubmitSuccess) {
        setTimeout(() => {
          onSubmitSuccess(result.data);
        }, 350);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Failed to save expense. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      {errorMessage && (
        <div className="badge badge-danger form-alert-box">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="badge badge-success form-alert-box">
          <Check size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Title */}
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Expense Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="e.g. Canteen Lunch, Metro Pass, Movie"
          value={formData.title}
          onChange={handleChange}
          className={`form-input ${formErrors.title ? 'error' : ''}`}
          maxLength={150}
          disabled={submitting}
        />
        {formErrors.title && <p className="form-error">{formErrors.title}</p>}
      </div>

      {/* Amount and Payment Method in 2 columns */}
      <div className="form-row-2">
        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            Amount (INR ₹) *
          </label>
          <div className="input-with-prefix">
            <span className="input-currency-prefix">₹</span>
            <input
              id="amount"
              name="amount"
              type="number"
              step="any"
              min="0.5"
              placeholder="120"
              value={formData.amount}
              onChange={handleChange}
              className={`form-input has-prefix ${formErrors.amount ? 'error' : ''}`}
              disabled={submitting}
            />
          </div>
          {formErrors.amount && <p className="form-error">{formErrors.amount}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="payment_method" className="form-label">
            Payment Method *
          </label>
          <select
            id="payment_method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className={`form-select ${formErrors.payment_method ? 'error' : ''}`}
            disabled={submitting}
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
          {formErrors.payment_method && (
            <p className="form-error">{formErrors.payment_method}</p>
          )}
        </div>
      </div>

      {/* Category and Date in 2 columns */}
      <div className="form-row-2">
        <div className="form-group">
          <label htmlFor="category_id" className="form-label">
            Category *
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className={`form-select ${formErrors.category_id ? 'error' : ''}`}
            disabled={submitting || loadingCategories}
          >
            {loadingCategories ? (
              <option>Loading categories...</option>
            ) : (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))
            )}
          </select>
          {formErrors.category_id && (
            <p className="form-error">{formErrors.category_id}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="expense_date" className="form-label">
            Date *
          </label>
          <input
            id="expense_date"
            name="expense_date"
            type="date"
            value={formData.expense_date}
            onChange={handleChange}
            className={`form-input ${formErrors.expense_date ? 'error' : ''}`}
            disabled={submitting}
          />
          {formErrors.expense_date && (
            <p className="form-error">{formErrors.expense_date}</p>
          )}
        </div>
      </div>

      {/* Optional Description */}
      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Notes / Description <span className="label-opt">(Optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          placeholder="e.g. Treated college friends after lab test"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          maxLength={500}
          disabled={submitting}
        />
      </div>

      {/* Form Action Buttons */}
      <div className="form-actions-row">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary submit-btn"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="spinner" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <PlusCircle size={18} />
              <span>{initialData ? 'Update Expense' : 'Save Expense'}</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 600px) {
          .form-row-2 {
            grid-template-columns: 1fr 1fr;
          }
        }

        .input-with-prefix {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-currency-prefix {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
          font-weight: 700;
          font-size: 1.05rem;
          pointer-events: none;
        }

        .form-input.has-prefix {
          padding-left: 2.2rem;
        }

        .label-opt {
          font-weight: 400;
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        .form-alert-box {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-actions-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .submit-btn {
          min-width: 150px;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
