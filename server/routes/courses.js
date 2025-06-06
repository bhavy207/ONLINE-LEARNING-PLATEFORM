const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { auth, checkRole } = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .select('-lessons -quizzes');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('lessons')
      .populate('quizzes');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
});

// Create new course (instructor only)
router.post('/', auth, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      instructor: req.user._id
    });
    
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
});

// Update course (instructor only)
router.put('/:id', auth, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor
    if (course.instructor.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    Object.assign(course, req.body);
    await course.save();
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
});

// Delete course (instructor only)
router.delete('/:id', auth, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor
    if (course.instructor.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }
    
    await course.remove();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

// Enroll in a course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    course.enrolledStudents.push(req.user._id);
    await course.save();
    
    // Add course to user's enrolled courses
    req.user.enrolledCourses.push(course._id);
    await req.user.save();
    
    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
});

// Add review to course
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is enrolled
    if (!course.enrolledStudents.includes(req.user._id)) {
      return res.status(403).json({ message: 'Must be enrolled to review' });
    }
    
    const { rating, comment } = req.body;
    
    // Add review
    course.reviews.push({
      user: req.user._id,
      rating,
      comment
    });
    
    // Update course rating
    const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
    course.rating = totalRating / course.reviews.length;
    
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
});

module.exports = router; 