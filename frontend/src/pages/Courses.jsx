import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import api from '../utils/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Photography'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, selectedCategory, selectedLevel]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedLevel) params.append('level', selectedLevel);

      const response = await api.get(`/courses?${params.toString()}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLevel('');
  };

  return (
    <div className="courses-page">
      <div className="container">
        <div className="page-header">
          <h1>Explore Courses</h1>
          <p>Discover your next learning adventure</p>
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="search-icon">🔍</div>
          </div>

          <div className="filters">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="filter-select"
            >
              <option value="">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            {(searchTerm || selectedCategory || selectedLevel) && (
              <button onClick={clearFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="results-section">
          <div className="results-header">
            <h3>
              {loading ? 'Loading...' : `${courses.length} course${courses.length !== 1 ? 's' : ''} found`}
            </h3>
          </div>

          {loading ? (
            <div className="loading">Loading courses...</div>
          ) : courses.length > 0 ? (
            <div className="grid grid-3">
              {courses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No courses found</h3>
              <p>Try adjusting your search criteria</p>
              <button onClick={clearFilters} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Popular Categories */}
        <div className="popular-categories">
          <h2>Popular Categories</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-card ${selectedCategory === category ? 'active' : ''}`}
              >
                <div className="category-icon">
                  {category === 'Programming' ? '💻' :
                   category === 'Design' ? '🎨' :
                   category === 'Business' ? '💼' :
                   category === 'Marketing' ? '📢' :
                   category === 'Data Science' ? '📊' :
                   category === 'Photography' ? '📸' : '📚'}
                </div>
                <h4>{category}</h4>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
