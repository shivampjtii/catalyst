const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  youtubeId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  duration: { type: Number, default: 0 }, // in seconds
  order: { type: Number, required: true },
  playlistId: { type: String }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'DSA', 'AI/ML', 'Python', 'JavaScript', 'System Design', 'DevOps', 'Database', 'Mobile Dev', 'Other']
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  youtubePlaylistId: {
    type: String,
    required: [true, 'YouTube Playlist ID is required']
  },
  videos: [videoSchema],
  instructor: {
    type: String,
    required: true
  },
  tags: [String],
  totalDuration: {
    type: Number,
    default: 0 // in seconds
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
