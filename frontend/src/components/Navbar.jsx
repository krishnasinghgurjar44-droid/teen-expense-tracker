import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor, LogOut, User, PlusCircle } from 'lucide-react';
import { getGreeting } from '../utils/formatters';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { themeMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo (Visible on mobile when sidebar is hidden) */}
        <Link to="/dashboard" className="navbar-brand">
          <div className="navbar-logo-badge">⚡</div>
          <span className="navbar-brand-name">
            Teen<span className="brand-gradient">Spend</span>
          </span>
        </Link>

        {/* Greeting */}
        <div className="navbar-greeting">
          <span className="greeting-text">
            {getGreeting()},{' '}
            <strong className="greeting-user">{user?.name ? user.name.split(' ')[0] : 'there'}</strong> 👋
          </span>
        </div>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Quick Add Expense button */}
          <Link to="/add-expense" className="btn btn-primary btn-sm desktop-only">
            <PlusCircle size={16} />
            <span>Add Expense</span>
          </Link>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Current theme: ${themeMode}. Click to toggle.`}
            aria-label="Toggle color theme"
          >
            {themeMode === 'light' && <Sun size={18} className="theme-icon sun" />}
            {themeMode === 'dark' && <Moon size={18} className="theme-icon moon" />}
            {themeMode === 'system' && <Monitor size={18} className="theme-icon system" />}
          </button>

          {/* Profile Quick Link */}
          <Link to="/profile" className="profile-btn" title="View Profile">
            <div className="profile-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
            </div>
            <span className="profile-name desktop-only">{user?.name ? user.name.split(' ')[0] : 'Profile'}</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="btn-icon btn-ghost logout-btn desktop-only"
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .navbar-container {
          height: var(--navbar-height);
          background: var(--bg-glass);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 30;
          width: 100%;
        }

        .navbar-inner {
          height: 100%;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        @media (min-width: 1024px) {
          .navbar-brand {
            display: none;
          }
        }

        .navbar-logo-badge {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-md);
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }

        .navbar-brand-name {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .brand-gradient {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .navbar-greeting {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .greeting-user {
          color: var(--text-primary);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .theme-toggle-btn {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .theme-toggle-btn:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.5rem;
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }

        .profile-btn:hover {
          background: var(--bg-card-hover);
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--primary-gradient-subtle);
          border: 1px solid var(--primary-500);
          color: var(--primary-500);
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
