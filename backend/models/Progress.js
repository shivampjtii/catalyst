const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  videoId: String,
  score: Number,
  totalQuestions: Number,
  answers: [{
    question: String,
    selectedAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean
  }],
  completedAt: { type: Date, default: Date.now }
});

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
  completedVideos: [{
    videoId: String,
    youtubeId: String,
    completedAt: { type: Date, default: Date.now },
    watchTime: Number // seconds
  }],
  currentVideo: {
    videoId: String,
    timestamp: { type: Number, default: 0 }
  },
  quizResults: [quizResultSchema],
  overallProgress: {
    type: Number,
    default: 0 // percentage
  },
  totalWatchTime: {
    type: Number,
    default: 0 // seconds
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  averageQuizScore: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Unique constraint per user+course
progressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
