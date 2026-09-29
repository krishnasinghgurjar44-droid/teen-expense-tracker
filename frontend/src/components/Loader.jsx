import React from 'react';
import { Loader2 } from 'lucide-react';

export function SpinnerLoader({ message = 'Loading...' }) {
  return (
    <div className="spinner-loader-wrap">
      <Loader2 size={32} className="spin-icon" color="#6366f1" />
      {message && <p className="spinner-msg">{message}</p>}

      <style>{`
        .spinner-loader-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          min-height: 200px;
          gap: 0.75rem;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        .spinner-msg {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function SkeletonCard({ count = 1 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card skeleton-card">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-value" />
          <div className="skeleton skeleton-sub" />
        </div>
      ))}

      <style>{`
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
          width: 100%;
        }

        .skeleton-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .skeleton-title {
          width: 50%;
          height: 16px;
        }

        .skeleton-value {
          width: 75%;
          height: 32px;
        }

        .skeleton-sub {
          width: 40%;
          height: 12px;
        }
      `}</style>
    </div>
  );
}

export default SpinnerLoader;
