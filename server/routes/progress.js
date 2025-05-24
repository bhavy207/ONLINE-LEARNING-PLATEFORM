const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

// Get user's progress for all courses
router.get('/', auth, async (req, res) => {
    try {
        const progress = await Progress.find({ user: req.user._id })
            .populate('course')
            .populate('completedLessons.lesson')
            .populate('quizScores.quiz');
        
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error: error.message });
    }
});

// Get user's progress for a specific course
router.get('/:courseId', auth, async (req, res) => {
    try {
        const progress = await Progress.findOne({
            user: req.user._id,
            course: req.params.courseId
        })
        .populate('course')
        .populate('completedLessons.lesson')
        .populate('quizScores.quiz');

        if (!progress) {
            return res.status(404).json({ message: 'Progress not found for this course' });
        }

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error: error.message });
    }
});

// Get course statistics (instructor only)
router.get('/course/:courseId/stats', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the instructor
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view course statistics' });
        }

        const progress = await Progress.find({ course: req.params.courseId })
            .populate('user', 'name email')
            .populate('completedLessons.lesson')
            .populate('quizScores.quiz');

        // Calculate statistics
        const stats = {
            totalStudents: progress.length,
            averageProgress: progress.reduce((acc, curr) => acc + curr.overallProgress, 0) / progress.length,
            completionRate: (progress.filter(p => p.status === 'completed').length / progress.length) * 100,
            averageQuizScore: progress.reduce((acc, curr) => {
                const quizScores = curr.quizScores.map(qs => qs.score);
                return acc + (quizScores.reduce((a, b) => a + b, 0) / quizScores.length);
            }, 0) / progress.length,
            studentProgress: progress.map(p => ({
                student: p.user,
                progress: p.overallProgress,
                status: p.status,
                lastAccessed: p.lastAccessed
            }))
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course statistics', error: error.message });
    }
});

// Update last accessed time
router.put('/:courseId/last-accessed', auth, async (req, res) => {
    try {
        const progress = await Progress.findOne({
            user: req.user._id,
            course: req.params.courseId
        });

        if (!progress) {
            return res.status(404).json({ message: 'Progress not found for this course' });
        }

        progress.lastAccessed = new Date();
        await progress.save();

        res.json({ message: 'Last accessed time updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating last accessed time', error: error.message });
    }
});

module.exports = router; 