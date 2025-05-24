const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        correctAnswer: {
            type: Number,
            required: true
        },
        explanation: String
    }],
    passingScore: {
        type: Number,
        required: true,
        default: 70
    },
    timeLimit: {
        type: Number, // Time limit in minutes
        required: true,
        default: 30
    },
    attempts: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: Number,
        answers: [{
            questionIndex: Number,
            selectedOption: Number,
            isCorrect: Boolean
        }],
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
quizSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz; 