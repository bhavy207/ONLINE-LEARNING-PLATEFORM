const express = require('express');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get progress for a course
router.get('/:courseId', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId
    }).populate('course');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update lesson completion
router.post('/:courseId/lesson/:lessonId', auth, async (req, res) => {
  try {
    let progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId
    });

    if (!progress) {
      progress = new Progress({
        user: req.user._id,
        course: req.params.courseId,
        completedLessons: []
      });
    }

    const lessonId = req.params.lessonId;
    const existingLesson = progress.completedLessons.find(
      lesson => lesson.lessonId.toString() === lessonId
    );

    if (!existingLesson) {
      progress.completedLessons.push({ lessonId });
    }

    // Calculate progress percentage
    const course = await Course.findById(req.params.courseId);
    const totalLessons = course.lessons.length;
    const completedLessons = progress.completedLessons.length;
    progress.progressPercentage = (completedLessons / totalLessons) * 100;
    progress.lastAccessed = new Date();

    await progress.save();

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
