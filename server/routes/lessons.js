const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const { auth, checkRole } = require('../middleware/auth');

// Get lessons for a course
router.get('/:courseId', auth, async (req, res) => {
    try {
        const lessons = await Lesson.find({ course: req.params.courseId })
            .sort({ order: 1 });
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lessons', error: error.message });
    }
});

// Get lesson by ID
router.get('/lesson/:id', auth, async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id)
            .populate('course')
            .populate('quiz');
        
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Check if user is enrolled in the course
        const course = await Course.findById(lesson.course);
        if (!course.enrolledStudents.includes(req.user._id) && req.user.role !== 'instructor') {
            return res.status(403).json({ message: 'Not enrolled in this course' });
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
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
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
        const lesson = await Lesson.findById(req.params.id);
        
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        const course = await Course.findById(lesson.course);
        
        // Check if user is the instructor
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this lesson' });
        }

        const updatedLesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedLesson);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lesson', error: error.message });
    }
});

// Delete lesson (instructor only)
router.delete('/:id', auth, checkRole(['instructor', 'admin']), async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        const course = await Course.findById(lesson.course);
        
        // Check if user is the instructor
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this lesson' });
        }

        // Remove lesson from course
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
        const lesson = await Lesson.findById(req.params.id);
        
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Check if already completed
        if (lesson.completedBy.some(completion => completion.user.toString() === req.user._id.toString())) {
            return res.status(400).json({ message: 'Lesson already completed' });
        }

        // Add completion record
        lesson.completedBy.push({
            user: req.user._id,
            completedAt: new Date()
        });
        await lesson.save();

        // Update progress
        let progress = await Progress.findOne({
            user: req.user._id,
            course: lesson.course
        });

        if (!progress) {
            progress = new Progress({
                user: req.user._id,
                course: lesson.course,
                completedLessons: []
            });
        }

        progress.completedLessons.push({
            lesson: lesson._id,
            completedAt: new Date()
        });

        // Calculate overall progress
        const course = await Course.findById(lesson.course);
        progress.overallProgress = progress.calculateProgress(course.lessons.length);
        progress.status = progress.overallProgress === 100 ? 'completed' : 'in_progress';
        
        await progress.save();

        res.json({ message: 'Lesson marked as completed' });
    } catch (error) {
        res.status(500).json({ message: 'Error completing lesson', error: error.message });
    }
});

module.exports = router; 