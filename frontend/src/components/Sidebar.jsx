import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ReceiptText,
  PlusCircle,
  PiggyBank,
  PieChart,
  UserCheck,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/expenses', label: 'Expenses', icon: ReceiptText },
    { to: '/add-expense', label: 'Add Expense', icon: PlusCircle },
    { to: '/budget', label: 'Budget', icon: PiggyBank },
    { to: '/analytics', label: 'Analytics', icon: PieChart },
    { to: '/profile', label: 'Profile', icon: UserCheck }
  ];

  return (
    <aside className="sidebar-container">
      {/* Brand Header */}
      <div className="sidebar-brand-header">
        <div className="brand-logo-container">
          <div className="sidebar-logo-badge">⚡</div>
          <div>
            <h2 className="sidebar-brand-title">
              Teen<span className="brand-gradient">Spend</span>
            </h2>
            <span className="sidebar-brand-tagline">Smart Money Habits</span>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">MENU</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              <Icon size={19} className="nav-link-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Educational Mini Prompt */}
      <div className="sidebar-edu-card">
        <div className="edu-card-icon">
          <Sparkles size={16} />
        </div>
        <p className="edu-card-text">
          "Small daily savings become big future freedom."
        </p>
      </div>

      {/* User Footer Profile */}
      <div className="sidebar-footer">
        <div className="footer-user-info">
          <div className="user-avatar-circle">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
          </div>
          <div className="user-text-info">
            <span className="user-display-name">{user?.name || 'Teen User'}</span>
            <span className="user-email-subtitle">{user?.email || 'user@teenspend.app'}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn-icon btn-ghost footer-logout-btn"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>

      <style>{`
        .sidebar-container {
          width: var(--sidebar-width);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          background: var(--bg-surface);
          border-right: 1px solid var(--border-color);
          display: none;
          flex-direction: column;
          z-index: 40;
          box-shadow: var(--shadow-sm);
        }

        @media (min-width: 1024px) {
          .sidebar-container {
            display: flex;
          }
        }

        .sidebar-brand-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .brand-logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sidebar-logo-badge {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
        }

        .sidebar-brand-title {
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 0.1rem;
        }

        .brand-gradient {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-brand-tagline {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
          display: block;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          overflow-y: auto;
        }

        .nav-section-title {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          padding: 0.5rem 0.75rem 0.25rem 0.75rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 0.9rem;
          border-radius: var(--radius-md);
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .nav-link:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .nav-link-active {
          background: var(--primary-50);
          color: var(--primary-600);
          box-shadow: inset 3px 0 0 var(--primary-600);
        }

        [data-theme='dark'] .nav-link-active {
          background: rgba(99, 102, 241, 0.15);
          color: var(--primary-500);
          box-shadow: inset 3px 0 0 var(--primary-500);
        }

        .nav-link-icon {
          flex-shrink: 0;
        }

        .sidebar-edu-card {
          margin: 0.75rem 1rem;
          padding: 0.9rem;
          border-radius: var(--radius-md);
          background: var(--primary-gradient-subtle);
          border: 1px solid rgba(99, 102, 241, 0.2);
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
        }

        .edu-card-icon {
          color: var(--primary-500);
          margin-top: 0.1rem;
        }

        .edu-card-text {
          font-size: 0.75rem;
          line-height: 1.4;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-surface);
        }

        .footer-user-info {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-width: 0;
        }

        .user-avatar-circle {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: var(--primary-gradient);
          color: #ffffff;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .user-text-info {
          min-width: 0;
        }

        .user-display-name {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email-subtitle {
          display: block;
          font-size: 0.72rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .footer-logout-btn {
          color: var(--text-muted);
        }

        .footer-logout-btn:hover {
          color: var(--danger);
        }
      `}</style>
    </aside>
  );
}
