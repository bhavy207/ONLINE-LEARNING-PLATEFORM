const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const { auth, checkRole } = require('../middleware/auth');

// Get all quizzes for a course
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
      return res.status(403).json({ message: 'Not authorized to view quizzes' });
    }
    
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
  }
});

// Get quiz by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('course');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if user is enrolled or instructor
    if (!quiz.course.enrolledStudents.includes(req.user._id) && 
        quiz.course.instructor.toString() !== req.user._id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view quiz' });
    }
    
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz', error: error.message });
  }
});

// Create new quiz (instructor only)
router.post('/', auth, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const course = await Course.findById(req.body.course);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor
    if (course.instructor.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create quizzes for this course' });
    }
    
    const quiz = new Quiz(req.body);
    await quiz.save();
    
    // Add quiz to course
    course.quizzes.push(quiz._id);
    await course.save();
    
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error creating quiz', error: error.message });
  }
});

// Update quiz (instructor only)
router.put('/:id', auth, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('course');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if user is the instructor
    if (quiz.course.instructor.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this quiz' });
    }
    
    Object.assign(quiz, req.body);
    await quiz.save();
    
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error updating quiz', error: error.message });
  }
});

// Delete quiz (instructor only)
router.delete('/:id', auth, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('course');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if user is the instructor
    if (quiz.course.instructor.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }
    
    // Remove quiz from course
    const course = quiz.course;
    course.quizzes = course.quizzes.filter(q => q.toString() !== quiz._id.toString());
    await course.save();
    
    await quiz.remove();
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting quiz', error: error.message });
  }
});

// Submit quiz attempt
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('course');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if user is enrolled
    if (!quiz.course.enrolledStudents.includes(req.user._id)) {
      return res.status(403).json({ message: 'Must be enrolled to take quiz' });
    }
    
    const { answers } = req.body;
    
    // Calculate score
    let score = 0;
    const gradedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer === question.correctAnswer;
      if (isCorrect) {
        score += question.points;
      }
      return {
        questionIndex: index,
        selectedOption: answer,
        isCorrect
      };
    });
    
    // Add attempt
    quiz.attempts.push({
      user: req.user._id,
      score,
      answers: gradedAnswers,
      completedAt: new Date()
    });
    
    await quiz.save();
    
    res.json({
      score,
      totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0),
      passed: score >= quiz.passingScore,
      answers: gradedAnswers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quiz', error: error.message });
  }
});

module.exports = router; 