import React from 'react';

const ProgressBar = ({ progress, total, percentage }) => {
  const progressPercentage = percentage || (total > 0 ? (progress / total) * 100 : 0);
  
  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-text">
          Progress: {Math.round(progressPercentage)}%
        </span>
        <span className="progress-count">
          {progress} / {total} lessons completed
        </span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        >
          <span className="progress-label">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>
      
      {progressPercentage === 100 && (
        <div className="completion-badge">
          🎉 Course Completed! 🎉
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
