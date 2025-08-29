import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import ProgressBar from '../components/ProgressBar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [id, user]);

  const fetchCourseData = async () => {
    try {
      const courseResponse = await api.get(`/courses/${id}`);
      setCourse(courseResponse.data);
      
      if (courseResponse.data.lessons.length > 0) {
        setCurrentLesson(courseResponse.data.lessons[0]);
      }

      if (isAuthenticated) {
        // Check if user is enrolled
        const enrolled = user?.enrolledCourses?.includes(id) || 
                        courseResponse.data.enrolledStudents?.includes(user?.id);
        setIsEnrolled(enrolled);

        // Fetch progress if enrolled
        if (enrolled) {
          try {
            const progressResponse = await api.get(`/progress/${id}`);
            setProgress(progressResponse.data);
          } catch (error) {
            // Progress not found, user hasn't started yet
            console.log('No progress found');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Course not found');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollment = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll in courses');
      return;
    }

    try {
      await api.post(`/courses/${id}/enroll`);
      setIsEnrolled(true);
      toast.success('Successfully enrolled in course!');
      fetchCourseData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    }
  };

  const handleLessonComplete = async (lessonId) => {
    if (!isAuthenticated || !isEnrolled) return;

    try {
      const response = await api.post(`/progress/${id}/lesson/${lessonId}`);
      setProgress(response.data);
      toast.success('Lesson marked as complete!');
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) return <div className="loading">Loading course...</div>;
  if (!course) return <Navigate to="/courses" replace />;

  return (
    <div className="course-detail">
      <div className="container">
        <div className="course-layout">
          {/* Course Header */}
          <div className="course-header">
            <div className="course-info">
              <h1>{course.title}</h1>
              <p className="course-description">{course.description}</p>
              
              <div className="course-meta">
                <span className="instructor">👨‍🏫 {course.instructor?.name}</span>
                <span className="category">📁 {course.category}</span>
                <span className="level">📊 {course.level}</span>
              </div>

              <div className="course-stats">
                <span>⏱️ {course.totalDuration || 0} minutes</span>
                <span>📚 {course.lessons?.length || 0} lessons</span>
                <span>👥 {course.enrolledStudents?.length || 0} students</span>
              </div>

              {isAuthenticated && isEnrolled && progress && (
                <div className="course-progress">
                  <ProgressBar 
                    progress={progress.completedLessons?.length || 0}
                    total={course.lessons?.length || 0}
                    percentage={progress.progressPercentage || 0}
                  />
                </div>
              )}
            </div>

            <div className="enrollment-section">
              <div className="price">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </div>
              
              {isAuthenticated ? (
                isEnrolled ? (
                  <div className="enrolled-badge">✅ Enrolled</div>
                ) : (
                  <button onClick={handleEnrollment} className="btn btn-primary">
                    Enroll Now
                  </button>
                )
              ) : (
                <div className="login-prompt">
                  <p>Please login to enroll</p>
                  <a href="/login" className="btn btn-primary">Login</a>
                </div>
              )}
            </div>
          </div>

          {/* Course Content */}
          {isEnrolled && course.lessons?.length > 0 ? (
            <div className="course-content">
              <div className="video-section">
                {currentLesson && (
                  <VideoPlayer 
                    lesson={currentLesson}
                    onLessonComplete={handleLessonComplete}
                  />
                )}
              </div>

              <div className="lessons-sidebar">
                <h3>Course Content</h3>
                <div className="lessons-list">
                  {course.lessons.map((lesson, index) => {
                    const isCompleted = progress?.completedLessons?.some(
                      cl => cl.lessonId === lesson._id
                    );
                    
                    return (
                      <div
                        key={lesson._id}
                        className={`lesson-item ${currentLesson?._id === lesson._id ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                        onClick={() => setCurrentLesson(lesson)}
                      >
                        <div className="lesson-number">{index + 1}</div>
                        <div className="lesson-info">
                          <h4>{lesson.title}</h4>
                          <span className="lesson-duration">⏱️ {lesson.duration || 0} min</span>
                        </div>
                        {isCompleted && <div className="lesson-status">✅</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : !isEnrolled ? (
            <div className="course-preview">
              <h3>Course Curriculum</h3>
              <div className="preview-lessons">
                {course.lessons?.map((lesson, index) => (
                  <div key={lesson._id} className="preview-lesson">
                    <div className="lesson-number">{index + 1}</div>
                    <div className="lesson-info">
                      <h4>{lesson.title}</h4>
                      <p>{lesson.description}</p>
                      <span className="lesson-duration">⏱️ {lesson.duration || 0} minutes</span>
                    </div>
                    <div className="lesson-lock">🔒</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-content">
              <div className="empty-icon">📚</div>
              <h3>No content available</h3>
              <p>This course doesn't have any lessons yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
