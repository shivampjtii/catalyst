const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const User = require('../models/User');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

// @route GET /api/progress/:courseId
router.get('/:courseId', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId
    });

    if (!progress) return res.status(404).json({ message: 'Progress not found' });
    res.json({ progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/progress/complete-video
router.post('/complete-video', protect, async (req, res) => {
  try {
    const { courseId, videoId, youtubeId, watchTime } = req.body;

    let progress = await Progress.findOne({ user: req.user._id, course: courseId });
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    // Check if video already completed
    const alreadyCompleted = progress.completedVideos.find(v => v.youtubeId === youtubeId);
    if (!alreadyCompleted) {
      progress.completedVideos.push({ videoId, youtubeId, watchTime });
    }

    // Calculate overall progress
    const course = await Course.findById(courseId);
    const totalVideos = course.videos.length;
    progress.overallProgress = Math.round((progress.completedVideos.length / totalVideos) * 100);
    progress.totalWatchTime += watchTime || 0;
    progress.lastAccessed = new Date();

    if (progress.overallProgress === 100) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    }

    await progress.save();

    // Update user XP and study time
    const xpGained = 50; // XP per video
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { xp: xpGained, totalStudyTime: Math.round((watchTime || 0) / 60) },
      lastStudyDate: new Date()
    });

    res.json({ progress, xpGained });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/progress/update-position
router.post('/update-position', protect, async (req, res) => {
  try {
    const { courseId, videoId, timestamp } = req.body;

    await Progress.findOneAndUpdate(
      { user: req.user._id, course: courseId },
      { 'currentVideo.videoId': videoId, 'currentVideo.timestamp': timestamp, lastAccessed: new Date() },
      { new: true }
    );

    res.json({ message: 'Position saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/progress/dashboard/stats
router.get('/dashboard/stats', protect, async (req, res) => {
  try {
    const progressList = await Progress.find({ user: req.user._id })
      .populate('course', 'title category thumbnail');

    const user = await User.findById(req.user._id);

    const stats = {
      enrolledCourses: progressList.length,
      completedCourses: progressList.filter(p => p.isCompleted).length,
      totalWatchTime: progressList.reduce((acc, p) => acc + p.totalWatchTime, 0),
      averageProgress: progressList.length > 0
        ? Math.round(progressList.reduce((acc, p) => acc + p.overallProgress, 0) / progressList.length)
        : 0,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      recentCourses: progressList.sort((a, b) => b.lastAccessed - a.lastAccessed).slice(0, 4)
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
