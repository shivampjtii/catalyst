const express = require('express');
const router = express.Router();
const axios = require('axios');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route POST /api/quiz/generate
router.post('/generate', protect, async (req, res) => {
  try {
    const { videoTitle, videoDescription, courseCategory, difficulty } = req.body;

    const prompt = `You are an expert educator creating a quiz for a tech learning platform.

Generate exactly 5 multiple-choice questions for a video about: "${videoTitle}"
Course category: ${courseCategory}
Difficulty: ${difficulty || 'Intermediate'}
${videoDescription ? `Video description: ${videoDescription}` : ''}

Requirements:
- Questions should test conceptual understanding, not just memorization
- Each question has 4 options (A, B, C, D)
- One correct answer per question
- Questions should be relevant to the video topic
- Make questions progressively challenging

Respond ONLY with a valid JSON array in this exact format:
[
  {
    "id": 1,
    "question": "Question text here?",
    "options": {
      "A": "Option A text",
      "B": "Option B text",
      "C": "Option C text",
      "D": "Option D text"
    },
    "correctAnswer": "A",
    "explanation": "Brief explanation why this is correct"
  }
]`;

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    });

    let quizText = response.data.content[0].text.trim();
    // Strip markdown code blocks if present
    quizText = quizText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const questions = JSON.parse(quizText);

    res.json({ questions });
  } catch (error) {
    console.error('Quiz generation error:', error.response?.data || error.message);
    // Fallback quiz if API fails
    res.json({
      questions: [
        {
          id: 1,
          question: "What is the primary purpose of the concept covered in this video?",
          options: { A: "Performance optimization", B: "Code organization", C: "Both A and B", D: "None of the above" },
          correctAnswer: "C",
          explanation: "Modern tech concepts often serve multiple purposes including both performance and organization."
        },
        {
          id: 2,
          question: "Which approach is considered best practice in modern development?",
          options: { A: "Writing monolithic code", B: "Modular and reusable components", C: "Avoiding documentation", D: "Hard-coding values" },
          correctAnswer: "B",
          explanation: "Modular, reusable code is a fundamental best practice in modern development."
        },
        {
          id: 3,
          question: "What should you do before implementing a new feature?",
          options: { A: "Skip planning", B: "Write code immediately", C: "Plan and understand requirements", D: "Copy from other projects" },
          correctAnswer: "C",
          explanation: "Proper planning and understanding requirements prevents issues later."
        },
        {
          id: 4,
          question: "How important is testing in software development?",
          options: { A: "Not important", B: "Optional", C: "Only for large projects", D: "Essential for all projects" },
          correctAnswer: "D",
          explanation: "Testing is essential regardless of project size to ensure reliability."
        },
        {
          id: 5,
          question: "What is the benefit of version control systems like Git?",
          options: { A: "Makes code run faster", B: "Tracks changes and enables collaboration", C: "Replaces documentation", D: "Automatically fixes bugs" },
          correctAnswer: "B",
          explanation: "Git tracks changes, enables collaboration, and provides history of the codebase."
        }
      ]
    });
  }
});

// @route POST /api/quiz/submit
router.post('/submit', protect, async (req, res) => {
  try {
    const { courseId, videoId, answers, questions } = req.body;

    let score = 0;
    const processedAnswers = questions.map(q => {
      const isCorrect = answers[q.id] === q.correctAnswer;
      if (isCorrect) score++;
      return {
        question: q.question,
        selectedAnswer: answers[q.id],
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const percentage = Math.round((score / questions.length) * 100);

    // Save quiz result to progress
    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, course: courseId },
      {
        $push: {
          quizResults: {
            videoId,
            score: percentage,
            totalQuestions: questions.length,
            answers: processedAnswers
          }
        }
      },
      { new: true }
    );

    // Recalculate average quiz score
    const avgScore = progress.quizResults.reduce((acc, q) => acc + q.score, 0) / progress.quizResults.length;
    progress.averageQuizScore = Math.round(avgScore);
    await progress.save();

    // Award XP based on score
    const xpGained = Math.round(percentage * 1.5); // max 150 XP
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { xp: xpGained }
    });

    res.json({
      score: percentage,
      correctAnswers: score,
      totalQuestions: questions.length,
      processedAnswers,
      xpGained,
      passed: percentage >= 60
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
