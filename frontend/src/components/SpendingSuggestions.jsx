import React from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';

export default function SpendingSuggestions({ suggestions = [] }) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const getTypeClass = (type) => {
    switch (type) {
      case 'danger':
        return 'suggestion-danger';
      case 'warning':
        return 'suggestion-warning';
      case 'success':
        return 'suggestion-success';
      case 'info':
      default:
        return 'suggestion-info';
    }
  };

  return (
    <section className="suggestions-section">
      <div className="suggestions-header">
        <div className="suggestions-badge-icon">
          <Lightbulb size={20} color="#f59e0b" />
        </div>
        <div>
          <h3 className="card-title">Smart Spending Suggestions</h3>
          <p className="card-subtitle">Practical, non-judgmental habits to keep your money balanced</p>
        </div>
      </div>

      <div className="suggestions-grid">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className={`suggestion-card ${getTypeClass(item.type)}`}
          >
            <div className="suggestion-card-header">
              <span className="suggestion-icon">{item.icon || '💡'}</span>
              <span className="suggestion-category-tag">{item.category}</span>
            </div>

            <h4 className="suggestion-title">{item.title}</h4>
            <p className="suggestion-explanation">{item.explanation}</p>

            {item.tip && (
              <div className="suggestion-tip-box">
                <span className="tip-badge">
                  <Sparkles size={13} />
                  <span>Tip</span>
                </span>
                <p className="tip-text">{item.tip}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .suggestions-section {
          margin-top: 2rem;
        }

        .suggestions-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .suggestions-badge-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: rgba(245, 158, 11, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        @media (min-width: 768px) {
          .suggestions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .suggestion-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.35rem;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }

        .suggestion-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .suggestion-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .suggestion-icon {
          font-size: 1.5rem;
        }

        .suggestion-category-tag {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .suggestion-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.4rem;
        }

        .suggestion-explanation {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin-bottom: 1rem;
          flex: 1;
        }

        .suggestion-tip-box {
          background: var(--bg-card-hover);
          border-radius: var(--radius-md);
          padding: 0.75rem 0.9rem;
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .tip-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary-500);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .tip-text {
          font-size: 0.8rem;
          color: var(--text-primary);
          line-height: 1.4;
          font-weight: 500;
        }

        .suggestion-warning {
          border-left: 4px solid var(--warning);
        }

        .suggestion-danger {
          border-left: 4px solid var(--danger);
        }

        .suggestion-success {
          border-left: 4px solid var(--success);
        }

        .suggestion-info {
          border-left: 4px solid var(--primary-500);
        }
      `}</style>
    </section>
  );
}
