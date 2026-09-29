import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Check if redirected due to expired session
  const query = new URLSearchParams(location.search);
  const sessionExpired = query.get('sessionExpired');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('teen@teenspend.app');
    setPassword('Password#123');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-header">
          <div className="auth-brand-badge">⚡</div>
          <h1 className="auth-title">
            Welcome to Teen<span className="brand-gradient">Spend</span>
          </h1>
          <p className="auth-subtitle">
            Log in to manage your daily expenses and smart budget
          </p>
        </div>

        {sessionExpired && (
          <div className="badge badge-warning auth-alert">
            Your previous session has expired. Please log in again.
          </div>
        )}

        {error && (
          <div className="badge badge-danger auth-alert">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <div className="password-label-row">
              <label className="form-label" htmlFor="password">
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="spinner" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Helper */}
        <div className="demo-helper-box">
          <div className="demo-helper-top">
            <Sparkles size={16} color="#6366f1" />
            <span className="demo-helper-title">Testing the app?</span>
          </div>
          <p className="demo-helper-text">
            Click below to instantly autofill test credentials pre-seeded with teenager data.
          </p>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="btn btn-secondary btn-sm demo-btn"
          >
            Use Demo Account (teen@teenspend.app)
          </button>
        </div>

        {/* Footer Link */}
        <div className="auth-footer">
          <span>Don't have an account yet?</span>{' '}
          <Link to="/register" className="auth-link">
            <span>Create one now</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <style>{`
        .auth-page-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.12), transparent 40%),
                      radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.08), transparent 40%),
                      var(--bg-primary);
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          padding: 2.25rem 2rem;
          box-shadow: var(--shadow-xl);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }

        .auth-brand-badge {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--primary-gradient);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
        }

        .auth-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin-bottom: 0.35rem;
        }

        .auth-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .auth-alert {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
          font-size: 0.85rem;
          display: block;
          text-align: center;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
        }

        .password-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 0.85rem;
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        .demo-helper-box {
          margin-top: 1.5rem;
          padding: 1rem;
          border-radius: var(--radius-md);
          background: var(--primary-gradient-subtle);
          border: 1px dashed rgba(99, 102, 241, 0.3);
          text-align: center;
        }

        .demo-helper-top {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          margin-bottom: 0.3rem;
        }

        .demo-helper-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--primary-500);
        }

        .demo-helper-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          line-height: 1.35;
        }

        .demo-btn {
          width: 100%;
          font-size: 0.78rem;
          padding: 0.5rem;
        }

        .auth-footer {
          margin-top: 1.75rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .auth-link {
          color: var(--primary-500);
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }

        .auth-link:hover {
          text-decoration: underline;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
