const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

// Get user's progress for all courses
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'progress.course',
        select: 'title description thumbnail'
      })
      .populate({
        path: 'progress.completedLessons',
        select: 'title duration'
      })
      .populate({
        path: 'progress.quizScores.quiz',
        select: 'title'
      });
    
    res.json(user.progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
});

// Get user's progress for a specific course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is enrolled
    if (!course.enrolledStudents.includes(req.user._id)) {
      return res.status(403).json({ message: 'Must be enrolled to view progress' });
    }
    
    const user = await User.findById(req.user._id)
      .populate({
        path: 'progress',
        match: { course: req.params.courseId },
        populate: [
          {
            path: 'completedLessons',
            select: 'title duration'
          },
          {
            path: 'quizScores.quiz',
            select: 'title'
          }
        ]
      });
    
    const progress = user.progress[0] || {
      course: req.params.courseId,
      completedLessons: [],
      quizScores: []
    };
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course progress', error: error.message });
  }
});

// Update user's progress
router.post('/course/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is enrolled
    if (!course.enrolledStudents.includes(req.user._id)) {
      return res.status(403).json({ message: 'Must be enrolled to update progress' });
    }
    
    const { completedLessons, quizScores } = req.body;
    
    // Find or create progress entry
    let progressIndex = req.user.progress.findIndex(
      p => p.course.toString() === req.params.courseId
    );
    
    if (progressIndex === -1) {
      req.user.progress.push({
        course: req.params.courseId,
        completedLessons: [],
        quizScores: []
      });
      progressIndex = req.user.progress.length - 1;
    }
    
    // Update completed lessons
    if (completedLessons) {
      req.user.progress[progressIndex].completedLessons = completedLessons;
    }
    
    // Update quiz scores
    if (quizScores) {
      req.user.progress[progressIndex].quizScores = quizScores;
    }
    
    await req.user.save();
    
    res.json(req.user.progress[progressIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
});

// Get course completion percentage
router.get('/course/:courseId/completion', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('lessons')
      .populate('quizzes');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is enrolled
    if (!course.enrolledStudents.includes(req.user._id)) {
      return res.status(403).json({ message: 'Must be enrolled to view completion' });
    }
    
    const user = await User.findById(req.user._id)
      .populate({
        path: 'progress',
        match: { course: req.params.courseId }
      });
    
    const progress = user.progress[0];
    
    if (!progress) {
      return res.json({
        completion: 0,
        completedLessons: 0,
        totalLessons: course.lessons.length,
        completedQuizzes: 0,
        totalQuizzes: course.quizzes.length
      });
    }
    
    const completedLessons = progress.completedLessons.length;
    const completedQuizzes = progress.quizScores.length;
    
    const totalItems = course.lessons.length + course.quizzes.length;
    const completedItems = completedLessons + completedQuizzes;
    
    const completion = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    
    res.json({
      completion,
      completedLessons,
      totalLessons: course.lessons.length,
      completedQuizzes,
      totalQuizzes: course.quizzes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating completion', error: error.message });
  }
});

module.exports = router; 