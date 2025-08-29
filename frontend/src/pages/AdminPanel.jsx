import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    price: 0,
    lessons: []
  });

  const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Photography'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'instructor')) {
      fetchCourses();
    }
  }, [isAuthenticated, user]);

  const fetchCourses = async () => {
    try {
      // For admin, get all courses. For instructor, get their courses
      const response = await api.get('/courses');
      const userCourses = user?.role === 'admin' 
        ? response.data 
        : response.data.filter(course => course.instructor._id === user.id);
      setCourses(userCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addLesson = () => {
    setFormData({
      ...formData,
      lessons: [
        ...formData.lessons,
        { title: '', description: '', videoUrl: '', duration: 0, order: formData.lessons.length }
      ]
    });
  };

  const updateLesson = (index, field, value) => {
    const updatedLessons = [...formData.lessons];
    updatedLessons[index][field] = value;
    setFormData({ ...formData, lessons: updatedLessons });
  };

  const removeLesson = (index) => {
    const updatedLessons = formData.lessons.filter((_, i) => i !== index);
    setFormData({ ...formData, lessons: updatedLessons });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...formData,
        totalDuration: formData.lessons.reduce((acc, lesson) => acc + (parseInt(lesson.duration) || 0), 0),
        isPublished: true
      };

      await api.post('/courses', courseData);
      toast.success('Course created successfully!');
      setFormData({
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        price: 0,
        lessons: []
      });
      setShowCreateForm(false);
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating course');
    }
  };

  const toggleCourseStatus = async (courseId, currentStatus) => {
    try {
      await api.put(`/courses/${courseId}`, { isPublished: !currentStatus });
      toast.success(`Course ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
      fetchCourses();
    } catch (error) {
      toast.error('Error updating course status');
    }
  };

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'instructor')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <h1>{user?.role === 'admin' ? 'Admin Panel' : 'Instructor Dashboard'}</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn btn-primary"
          >
            {showCreateForm ? 'Cancel' : '+ Create Course'}
          </button>
        </div>

        {showCreateForm && (
          <div className="create-course-form">
            <div className="card">
              <h2>Create New Course</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Course Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="level">Level</label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>

                {/* Lessons Section */}
                <div className="lessons-section">
                  <div className="lessons-header">
                    <h3>Lessons</h3>
                    <button type="button" onClick={addLesson} className="btn btn-secondary">
                      Add Lesson
                    </button>
                  </div>

                  {formData.lessons.map((lesson, index) => (
                    <div key={index} className="lesson-form">
                      <div className="lesson-header">
                        <h4>Lesson {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeLesson(index)}
                          className="btn btn-danger"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Title</label>
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => updateLesson(index, 'title', e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Duration (minutes)</label>
                          <input
                            type="number"
                            value={lesson.duration}
                            onChange={(e) => updateLesson(index, 'duration', e.target.value)}
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={lesson.description}
                          onChange={(e) => updateLesson(index, 'description', e.target.value)}
                          rows="2"
                        />
                      </div>

                      <div className="form-group">
                        <label>Video URL (optional)</label>
                        <input
                          type="url"
                          value={lesson.videoUrl}
                          onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
                          placeholder="https://example.com/video.mp4"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Create Course
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Courses List */}
        <div className="courses-section">
          <h2>Your Courses</h2>
          {loading ? (
            <div className="loading">Loading courses...</div>
          ) : courses.length > 0 ? (
            <div className="courses-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Students</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course._id}>
                      <td>
                        <div className="course-cell">
                          <h4>{course.title}</h4>
                          <p>{course.level}</p>
                        </div>
                      </td>
                      <td>{course.category}</td>
                      <td>{course.enrolledStudents?.length || 0}</td>
                      <td>
                        <span className={`status ${course.isPublished ? 'published' : 'draft'}`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleCourseStatus(course._id, course.isPublished)}
                          className={`btn ${course.isPublished ? 'btn-secondary' : 'btn-primary'}`}
                        >
                          {course.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No courses yet</h3>
              <p>Create your first course to get started</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary"
              >
                Create Course
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
