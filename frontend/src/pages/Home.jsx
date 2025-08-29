import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import api from '../utils/api';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await api.get('/courses?limit=6');
        setFeaturedCourses(response.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Learn Without Limits</h1>
            <p>
              Discover thousands of courses taught by expert instructors. 
              Start your learning journey today and unlock your potential.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">
                    Get Started
                  </Link>
                  <Link to="/courses" className="btn btn-secondary">
                    Browse Courses
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-placeholder">
              🎓
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose LearnHub?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">📚</div>
              <h3>Expert Instructors</h3>
              <p>Learn from industry professionals and experienced educators</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Learning</h3>
              <p>Track your progress and get personalized recommendations</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💻</div>
              <h3>Learn Anywhere</h3>
              <p>Access courses from any device, anytime, anywhere</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🏆</div>
              <h3>Certificates</h3>
              <p>Earn certificates upon course completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="featured-courses">
        <div className="container">
          <h2>Featured Courses</h2>
          {loading ? (
            <div className="loading">Loading courses...</div>
          ) : (
            <div className="grid grid-3">
              {featuredCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
          <div className="section-footer">
            <Link to="/courses" className="btn btn-primary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
