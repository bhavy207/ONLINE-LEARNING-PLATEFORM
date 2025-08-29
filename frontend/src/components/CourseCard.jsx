import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <div className="course-thumbnail">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} />
        ) : (
          <div className="thumbnail-placeholder">
            📚
          </div>
        )}
        <div className="course-level">{course.level}</div>
      </div>
      
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        
        <div className="course-meta">
          <span className="instructor">👨‍🏫 {course.instructor?.name}</span>
          <span className="category">📁 {course.category}</span>
        </div>
        
        <div className="course-stats">
          <span className="duration">⏱️ {course.totalDuration || 0} mins</span>
          <span className="students">👥 {course.enrolledStudents?.length || 0} students</span>
        </div>
        
        <div className="course-footer">
          <span className="price">
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </span>
          <Link to={`/courses/${course._id}`} className="btn btn-primary">
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
