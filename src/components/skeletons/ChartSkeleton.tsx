import React from 'react';
import './Skeleton.css';

const ChartSkeleton: React.FC = () => {
  return (
    <div className="chart-container skeleton-card">
        <div className="skeleton skeleton-title" style={{ height: '1.5rem', width: '40%', marginBottom: '1rem' }}></div>
        <div className="skeleton skeleton-chart"></div>
    </div>
  );
};

export default ChartSkeleton;