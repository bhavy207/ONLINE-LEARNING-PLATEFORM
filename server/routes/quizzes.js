const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const { auth, checkRole } = require('../middleware/auth');

// Get quiz by lesson ID
router.get('/:lessonId', auth, async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.lessonId);
        
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Check if user is enrolled in the course
        const course = await Course.findById(lesson.course);
        if (!course.enrolledStudents.includes(req.user._id) && req.user.role !== 'instructor') {
            return res.status(403).json({ message: 'Not enrolled in this course' });
        }

        const quiz = await Quiz.findOne({ lesson: req.params.lessonId });
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found for this lesson' });
        }

        // For students, don't send correct answers
        if (req.user.role === 'student') {
            const quizForStudent = {
                ...quiz.toObject(),
                questions: quiz.questions.map(q => ({
                    question: q.question,
                    options: q.options
                }))
            };
            return res.json(quizForStudent);
        }

        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz', error: error.message });
    }
});

// Create new quiz (instructor only)
router.post('/', auth, checkRole(['instructor', 'admin']), async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.body.lesson);
        
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        const course = await Course.findById(lesson.course);
        
        // Check if user is the instructor
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to create quiz for this lesson' });
        }

        const quiz = new Quiz(req.body);
        await quiz.save();

        // Add quiz to lesson
        lesson.quiz = quiz._id;
        await lesson.save();

        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error creating quiz', error: error.message });
    }
});

// Update quiz (instructor only)
router.put('/:id', auth, checkRole(['instructor', 'admin']), async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const lesson = await Lesson.findById(quiz.lesson);
        const course = await Course.findById(lesson.course);
        
        // Check if user is the instructor
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this quiz' });
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ message: 'Error updating quiz', error: error.message });
    }
});

// Delete quiz (instructor only)
router.delete('/:id', auth, checkRole(['instructor', 'admin']), async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const lesson = await Lesson.findById(quiz.lesson);
        const course = await Course.findById(lesson.course);
        
        // Check if user is the instructor
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this quiz' });
        }

        // Remove quiz from lesson
        lesson.quiz = null;
        await lesson.save();

        await quiz.remove();
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quiz', error: error.message });
    }
});

// Submit quiz attempt
router.post('/:id/submit', auth, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const lesson = await Lesson.findById(quiz.lesson);
        const course = await Course.findById(lesson.course);

        // Check if user is enrolled
        if (!course.enrolledStudents.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not enrolled in this course' });
        }

        const { answers } = req.body;
        
        // Calculate score
        let correctAnswers = 0;
        const detailedAnswers = answers.map((answer, index) => {
            const isCorrect = answer === quiz.questions[index].correctAnswer;
            if (isCorrect) correctAnswers++;
            return {
                questionIndex: index,
                selectedOption: answer,
                isCorrect
            };
        });

        const score = (correctAnswers / quiz.questions.length) * 100;
        const passed = score >= quiz.passingScore;

        // Save attempt
        quiz.attempts.push({
            user: req.user._id,
            score,
            answers: detailedAnswers,
            completedAt: new Date()
        });
        await quiz.save();

        // Update progress
        let progress = await Progress.findOne({
            user: req.user._id,
            course: course._id
        });

        if (!progress) {
            progress = new Progress({
                user: req.user._id,
                course: course._id,
                quizScores: []
            });
        }

        progress.quizScores.push({
            quiz: quiz._id,
            score,
            passed,
            completedAt: new Date()
        });

        await progress.save();

        res.json({
            score,
            passed,
            correctAnswers,
            totalQuestions: quiz.questions.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting quiz', error: error.message });
    }
});

module.exports = router; 