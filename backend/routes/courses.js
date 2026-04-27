const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

// @route GET /api/courses
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 12 } = req.query;
    let query = { isActive: true };

    if (category && category !== 'All') query.category = category;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const courses = await Course.find(query)
      .select('-videos')
      .sort({ enrolledCount: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/courses/enroll/:id
router.post('/enroll/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const user = await User.findById(req.user._id);
    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    user.enrolledCourses.push(course._id);
    await user.save();

    course.enrolledCount += 1;
    await course.save();

    // Create progress record
    await Progress.create({
      user: req.user._id,
      course: course._id,
      currentVideo: { videoId: course.videos[0]?._id, timestamp: 0 }
    });

    res.json({ message: 'Enrolled successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/courses (admin - create course)
router.post('/', protect, async (req, res) => {
  try {
    const courseData = { ...req.body, createdBy: req.user._id };
    const course = await Course.create(courseData);
    res.status(201).json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
