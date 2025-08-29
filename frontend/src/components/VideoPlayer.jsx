import React, { useState, useEffect } from 'react';

const VideoPlayer = ({ lesson, onLessonComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleVideoEnd = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      onLessonComplete && onLessonComplete(lesson._id);
    }
  };

  return (
    <div className="video-player">
      <div className="video-container">
        {lesson.videoUrl ? (
          <video 
            width="100%" 
            height="400"
            controls
            onEnded={handleVideoEnd}
            poster={lesson.thumbnail}
          >
            <source src={lesson.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="video-placeholder">
            <div className="placeholder-content">
              🎥
              <p>Video not available</p>
              <small>This lesson doesn't have a video yet.</small>
            </div>
          </div>
        )}
      </div>
      
      <div className="lesson-info">
        <h3>{lesson.title}</h3>
        {lesson.description && (
          <p className="lesson-description">{lesson.description}</p>
        )}
        
        <div className="lesson-meta">
          <span className="duration">⏱️ {lesson.duration || 0} minutes</span>
          {isCompleted && (
            <span className="completed">✅ Completed</span>
          )}
        </div>
        
        {!lesson.videoUrl && (
          <button 
            onClick={() => handleVideoEnd()} 
            className="btn btn-primary mark-complete"
          >
            Mark as Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
