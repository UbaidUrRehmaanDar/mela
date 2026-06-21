import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  const overlayRef = useRef();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handler = (e) => { if (e.key === 'Escape') onClose(); };
      document.addEventListener('keydown', handler);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handler);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    small: { maxWidth: '400px' },
    medium: { maxWidth: '600px' },
    large: { maxWidth: '800px' },
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '1rem', animation: 'fadeIn 0.2s ease'
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="brutal-border" style={{
        background: 'white', width: '100%', ...sizes[size],
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '8px 8px 0 black',
        animation: 'slideUp 0.25s ease'
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.25rem 1.5rem', borderBottom: '3px solid black'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'var(--pink)', border: '2px solid black', padding: '0.4rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              color: 'white', fontWeight: 700, lineHeight: 1
            }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
