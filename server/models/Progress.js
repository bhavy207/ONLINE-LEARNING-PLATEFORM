const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    completedLessons: [{
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson'
        },
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    quizScores: [{
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        },
        score: Number,
        passed: Boolean,
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    overallProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started'
    },
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
progressSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Calculate overall progress
progressSchema.methods.calculateProgress = function(totalLessons) {
    if (totalLessons === 0) return 0;
    return (this.completedLessons.length / totalLessons) * 100;
};

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress; 