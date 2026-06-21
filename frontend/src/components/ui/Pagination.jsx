import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="pagination" aria-label="Pagination" style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
      marginTop: '2rem', flexWrap: 'wrap'
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '0.5rem 0.8rem', border: '3px solid black', background: 'white',
          fontFamily: 'inherit', fontWeight: 700, cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '0.25rem'
        }}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} /> Prev
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} style={{
            padding: '0.5rem 0.8rem', border: '3px solid black', background: 'white',
            fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', minWidth: '2.5rem'
          }}>1</button>
          <span style={{ fontWeight: 700, padding: '0 0.25rem' }}>...</span>
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '0.5rem 0.8rem', border: '3px solid black', minWidth: '2.5rem',
            background: page === currentPage ? 'var(--yellow)' : 'white',
            fontFamily: 'inherit', fontWeight: 900, cursor: 'pointer',
            transform: page === currentPage ? 'translate(-2px, -2px)' : 'none',
            boxShadow: page === currentPage ? '4px 4px 0 black' : 'none',
          }}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          <span style={{ fontWeight: 700, padding: '0 0.25rem' }}>...</span>
          <button onClick={() => onPageChange(totalPages)} style={{
            padding: '0.5rem 0.8rem', border: '3px solid black', background: 'white',
            fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', minWidth: '2.5rem'
          }}>{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '0.5rem 0.8rem', border: '3px solid black', background: 'white',
          fontFamily: 'inherit', fontWeight: 700, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '0.25rem'
        }}
        aria-label="Next page"
      >
        Next <ChevronRight size={16} />
      </button>
    </nav>
  );
}
