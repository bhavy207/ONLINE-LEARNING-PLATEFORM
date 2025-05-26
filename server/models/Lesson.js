const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // Duration in seconds
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['pdf', 'link', 'document']
    },
    url: String
  }],
  completedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
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
lessonSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson; 