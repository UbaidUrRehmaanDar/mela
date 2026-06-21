import React from 'react';

function SkeletonLine({ className = '' }) {
  return <div className={`skeleton skeleton-line ${className}`.trim()} />;
}

function SkeletonCard({ children }) {
  return <div className="skeleton-card">{children}</div>;
}

function SkeletonGrid({ count = 6, columns = 3 }) {
  return (
    <div className={`grid-${columns}`}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i}>
          <div className="skeleton" style={{ height: 200, marginBottom: 16 }} />
          <SkeletonLine className="lg" />
          <SkeletonLine className="md" />
          <SkeletonLine className="sm" />
        </SkeletonCard>
      ))}
    </div>
  );
}

function SkeletonList({ count = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i}>
          <SkeletonLine className="lg" />
          <SkeletonLine className="md" />
          <SkeletonLine className="sm" />
        </SkeletonCard>
      ))}
    </div>
  );
}

export default SkeletonLine;
export { SkeletonLine, SkeletonCard, SkeletonGrid, SkeletonList };
