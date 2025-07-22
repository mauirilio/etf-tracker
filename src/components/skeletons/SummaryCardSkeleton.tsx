import React from 'react';
import './Skeleton.css';

const SummaryCardSkeleton: React.FC = () => {
  return (
    <div className="summary-card skeleton-card">
      <div className="skeleton skeleton-title" style={{ height: '1rem', width: '60%', marginBottom: '1rem' }}></div>
      <div className="skeleton skeleton-text" style={{ height: '2.5rem', width: '80%' }}></div>
    </div>
  );
};

export default SummaryCardSkeleton;