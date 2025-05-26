const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { auth, checkRole } = require('../middleware/auth');

// Get all lessons for a course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is enrolled or instructor
    if (!course.enrolledStudents.includes(req.user._id) && 
        course.instructor.toString() !== req.user._id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view lessons' });
    }
    
    const lessons = await Lesson.find({ course: req.params.courseId })
      .sort('order');
    
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons', error: error.message });
  }
});

// Get lesson by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course');
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Check if user is enrolled or instructor
    if (!lesson.course.enrolledStudents.includes(req.user._id) && 
        lesson.course.instructor.toString() !== req.user._id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view lesson' });
    }
    
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lesson', error: error.message });
  }
});

// Create new lesson (instructor only)
router.post('/', auth, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const course = await Course.findById(req.body.course);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor
    if (course.instructor.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create lessons for this course' });
    }
    
    const lesson = new Lesson(req.body);
    await lesson.save();
    
    // Add lesson to course
    course.lessons.push(lesson._id);
    await course.save();
    
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lesson', error: error.message });
  }
});

// Update lesson (instructor only)
router.put('/:id', auth, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course');
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Check if user is the instructor
    if (lesson.course.instructor.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this lesson' });
    }
    
    Object.assign(lesson, req.body);
    await lesson.save();
    
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Error updating lesson', error: error.message });
  }
});

// Delete lesson (instructor only)
router.delete('/:id', auth, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course');
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Check if user is the instructor
    if (lesson.course.instructor.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this lesson' });
    }
    
    // Remove lesson from course
    const course = lesson.course;
    course.lessons = course.lessons.filter(l => l.toString() !== lesson._id.toString());
    await course.save();
    
    await lesson.remove();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lesson', error: error.message });
  }
});

// Mark lesson as completed
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course');
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Check if user is enrolled
    if (!lesson.course.enrolledStudents.includes(req.user._id)) {
      return res.status(403).json({ message: 'Must be enrolled to mark lesson as complete' });
    }
    
    // Check if already completed
    const alreadyCompleted = lesson.completedBy.some(
      completion => completion.user.toString() === req.user._id.toString()
    );
    
    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Lesson already completed' });
    }
    
    // Add completion
    lesson.completedBy.push({
      user: req.user._id,
      completedAt: new Date()
    });
    
    await lesson.save();
    res.json({ message: 'Lesson marked as completed' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking lesson as complete', error: error.message });
  }
});

module.exports = router; 