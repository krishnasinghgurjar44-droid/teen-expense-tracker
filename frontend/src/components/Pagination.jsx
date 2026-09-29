import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-container">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="btn btn-secondary btn-sm pagination-nav-btn"
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} />
        <span className="pagination-text">Prev</span>
      </button>

      <div className="pagination-pages-group">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`pagination-num-btn ${p === currentPage ? 'pagination-num-active' : ''}`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="btn btn-secondary btn-sm pagination-nav-btn"
        aria-label="Next Page"
      >
        <span className="pagination-text">Next</span>
        <ChevronRight size={16} />
      </button>

      <style>{`
        .pagination-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          padding: 0.5rem 0;
        }

        .pagination-pages-group {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .pagination-num-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          transition: all var(--transition-fast);
        }

        .pagination-num-btn:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .pagination-num-active {
          background: var(--primary-gradient);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
        }

        .pagination-nav-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        @media (max-width: 480px) {
          .pagination-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
