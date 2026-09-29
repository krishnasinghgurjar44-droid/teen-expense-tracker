import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  Plus,
  PiggyBank,
  PieChart
} from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="bottom-nav-container">
      <div className="bottom-nav-inner">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`
          }
        >
          <LayoutDashboard size={20} />
          <span className="bottom-nav-label">Home</span>
        </NavLink>

        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`
          }
        >
          <ReceiptText size={20} />
          <span className="bottom-nav-label">Expenses</span>
        </NavLink>

        {/* Floating Add Expense Button */}
        <NavLink to="/add-expense" className="bottom-nav-fab" aria-label="Add Expense">
          <div className="fab-inner">
            <Plus size={24} color="#ffffff" strokeWidth={2.5} />
          </div>
        </NavLink>

        <NavLink
          to="/budget"
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`
          }
        >
          <PiggyBank size={20} />
          <span className="bottom-nav-label">Budget</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`
          }
        >
          <PieChart size={20} />
          <span className="bottom-nav-label">Charts</span>
        </NavLink>
      </div>

      <style>{`
        .bottom-nav-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--bottom-nav-height);
          background: var(--bg-surface);
          border-top: 1px solid var(--border-color);
          z-index: 40;
          box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
        }

        @media (min-width: 1024px) {
          .bottom-nav-container {
            display: none;
          }
        }

        .bottom-nav-inner {
          height: 100%;
          max-width: 500px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 0.5rem;
          position: relative;
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.2rem;
          color: var(--text-muted);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.4rem 0.6rem;
          border-radius: var(--radius-sm);
          transition: color var(--transition-fast);
          min-width: 56px;
        }

        .bottom-nav-item:hover {
          color: var(--text-primary);
        }

        .bottom-nav-item-active {
          color: var(--primary-500);
        }

        .bottom-nav-fab {
          position: relative;
          top: -14px;
        }

        .fab-inner {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-full);
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.45);
          transition: transform var(--transition-fast);
        }

        .bottom-nav-fab:active .fab-inner {
          transform: scale(0.92);
        }
      `}</style>
    </nav>
  );
}
