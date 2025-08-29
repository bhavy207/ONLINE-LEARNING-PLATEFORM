import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import api from '../utils/api';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentProgress, setRecentProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesResponse] = await Promise.all([
          api.get('/courses/enrolled/me')
        ]);
        
        setEnrolledCourses(coursesResponse.data);
        
        // Fetch progress for each enrolled course
        const progressPromises = coursesResponse.data.map(course => 
          api.get(`/progress/${course._id}`).catch(() => ({ data: null }))
        );
        
        const progressResponses = await Promise.all(progressPromises);
        const progressData = progressResponses
          .map(response => response.data)
          .filter(data => data !== null);
        
        setRecentProgress(progressData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Continue your learning journey</p>
        </div>

        {loading ? (
          <div className="loading">Loading your dashboard...</div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <h3>{enrolledCourses.length}</h3>
                  <p>Enrolled Courses</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <h3>{recentProgress.filter(p => p.progressPercentage === 100).length}</h3>
                  <p>Completed</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-info">
                  <h3>{recentProgress.filter(p => p.progressPercentage > 0 && p.progressPercentage < 100).length}</h3>
                  <p>In Progress</p>
                </div>
              </div>
            </div>

            {/* Continue Learning */}
            {enrolledCourses.length > 0 ? (
              <>
                <section className="continue-learning">
                  <h2>Continue Learning</h2>
                  <div className="progress-courses">
                    {recentProgress.slice(0, 3).map(progress => {
                      const course = enrolledCourses.find(c => c._id === progress.course._id);
                      return course ? (
                        <div key={course._id} className="progress-course-card">
                          <div className="course-info">
                            <h4>{course.title}</h4>
                            <p>👨‍🏫 {course.instructor?.name}</p>
                          </div>
                          <div className="progress-info">
                            <ProgressBar 
                              progress={progress.completedLessons.length}
                              total={course.lessons.length}
                              percentage={progress.progressPercentage}
                            />
                            <Link to={`/courses/${course._id}`} className="btn btn-primary">
                              Continue
                            </Link>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </section>

                <section className="enrolled-courses">
                  <h2>Your Courses</h2>
                  <div className="grid grid-3">
                    {enrolledCourses.map(course => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No courses yet</h3>
                <p>Start your learning journey by enrolling in a course</p>
                <Link to="/courses" className="btn btn-primary">
                  Browse Courses
                </Link>
              </div>
            )}

            {/* Quick Actions */}
            <section className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                <Link to="/courses" className="action-card">
                  <div className="action-icon">🔍</div>
                  <h4>Browse Courses</h4>
                  <p>Discover new courses to expand your skills</p>
                </Link>
                {user?.role === 'instructor' && (
                  <Link to="/admin" className="action-card">
                    <div className="action-icon">➕</div>
                    <h4>Create Course</h4>
                    <p>Share your knowledge with others</p>
                  </Link>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
