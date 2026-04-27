// backend/seed.js
// Run: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const sampleCourses = [
  {
    title: "Complete JavaScript Mastery",
    description: "Master JavaScript from fundamentals to advanced concepts. Covers ES6+, async/await, closures, prototypes, and modern JavaScript patterns used in real-world projects.",
    category: "JavaScript",
    difficulty: "Beginner",
    instructor: "Akshay Saini",
    youtubePlaylistId: "PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP",
    thumbnail: "https://i.ytimg.com/vi/pN6jk0uUrD8/hqdefault.jpg",
    tags: ["javascript", "es6", "web development", "frontend"],
    totalDuration: 72000,
    enrolledCount: 1240,
    videos: [
      { youtubeId: "pN6jk0uUrD8", title: "Namaste JavaScript Ep.1 - Execution Context", order: 1, duration: 1620, thumbnail: "https://i.ytimg.com/vi/pN6jk0uUrD8/mqdefault.jpg" },
      { youtubeId: "iLWTnMzWtj4", title: "How JS code is executed & Call Stack", order: 2, duration: 1350, thumbnail: "https://i.ytimg.com/vi/iLWTnMzWtj4/mqdefault.jpg" },
      { youtubeId: "Fnlnw8uY6jo", title: "Hoisting in JavaScript", order: 3, duration: 1200, thumbnail: "https://i.ytimg.com/vi/Fnlnw8uY6jo/mqdefault.jpg" },
      { youtubeId: "qikxEIxsXco", title: "Functions & Variable Environments", order: 4, duration: 1440, thumbnail: "https://i.ytimg.com/vi/qikxEIxsXco/mqdefault.jpg" },
      { youtubeId: "viQz4nUUnpw", title: "Shortest JS Program - window & this keyword", order: 5, duration: 900, thumbnail: "https://i.ytimg.com/vi/viQz4nUUnpw/mqdefault.jpg" },
      { youtubeId: "B7iF6G3EyIk", title: "Undefined vs Not Defined", order: 6, duration: 1080, thumbnail: "https://i.ytimg.com/vi/B7iF6G3EyIk/mqdefault.jpg" },
      { youtubeId: "3a9I8Dr0gu8", title: "The Scope Chain & Lexical Environment", order: 7, duration: 1260, thumbnail: "https://i.ytimg.com/vi/3a9I8Dr0gu8/mqdefault.jpg" },
      { youtubeId: "lW_erSjyMak", title: "Let & Const in JS - Temporal Dead Zone", order: 8, duration: 1500, thumbnail: "https://i.ytimg.com/vi/lW_erSjyMak/mqdefault.jpg" },
    ]
  },
  {
    title: "Data Structures & Algorithms in Python",
    description: "Comprehensive DSA course covering arrays, linked lists, trees, graphs, dynamic programming, and all major algorithms. Perfect for coding interviews at top tech companies.",
    category: "DSA",
    difficulty: "Intermediate",
    instructor: "Abdul Bari",
    youtubePlaylistId: "PLFW6lRTa1g81bEcygkAX-2ols2ZVVx3oH",
    thumbnail: "https://i.ytimg.com/vi/0IAPZzGSbME/hqdefault.jpg",
    tags: ["dsa", "algorithms", "python", "interview prep", "leetcode"],
    totalDuration: 144000,
    enrolledCount: 2150,
    videos: [
      { youtubeId: "0IAPZzGSbME", title: "Introduction to Data Structures", order: 1, duration: 2400, thumbnail: "https://i.ytimg.com/vi/0IAPZzGSbME/mqdefault.jpg" },
      { youtubeId: "9rhT3P1MDHk", title: "Arrays - The Backbone of DSA", order: 2, duration: 3000, thumbnail: "https://i.ytimg.com/vi/9rhT3P1MDHk/mqdefault.jpg" },
      { youtubeId: "iSps-ZEDmXU", title: "Linked Lists - Singly & Doubly", order: 3, duration: 3600, thumbnail: "https://i.ytimg.com/vi/iSps-ZEDmXU/mqdefault.jpg" },
      { youtubeId: "jVZuB975Dkc", title: "Stacks & Queues", order: 4, duration: 2700, thumbnail: "https://i.ytimg.com/vi/jVZuB975Dkc/mqdefault.jpg" },
      { youtubeId: "B31LgI4Y4DQ", title: "Binary Trees - Traversal & Operations", order: 5, duration: 3300, thumbnail: "https://i.ytimg.com/vi/B31LgI4Y4DQ/mqdefault.jpg" },
      { youtubeId: "0W6MImt0zAI", title: "Binary Search Trees", order: 6, duration: 2850, thumbnail: "https://i.ytimg.com/vi/0W6MImt0zAI/mqdefault.jpg" },
    ]
  },
  {
    title: "Machine Learning A-Z with Python",
    description: "Learn Machine Learning from scratch. Covers supervised & unsupervised learning, neural networks, regression, classification, clustering, and real-world ML projects.",
    category: "AI/ML",
    difficulty: "Intermediate",
    instructor: "Krish Naik",
    youtubePlaylistId: "PLZoTAELRMXVPBTrWtf0vFzNzDo8NyIxaQ",
    thumbnail: "https://i.ytimg.com/vi/7uwa9aPbBRU/hqdefault.jpg",
    tags: ["machine learning", "python", "ai", "scikit-learn", "deep learning"],
    totalDuration: 108000,
    enrolledCount: 1876,
    videos: [
      { youtubeId: "7uwa9aPbBRU", title: "What is Machine Learning?", order: 1, duration: 1800, thumbnail: "https://i.ytimg.com/vi/7uwa9aPbBRU/mqdefault.jpg" },
      { youtubeId: "1C3XiHK7UYw", title: "Types of ML - Supervised, Unsupervised, Reinforcement", order: 2, duration: 2100, thumbnail: "https://i.ytimg.com/vi/1C3XiHK7UYw/mqdefault.jpg" },
      { youtubeId: "E5RjzSK0fvY", title: "Linear Regression from Scratch", order: 3, duration: 2700, thumbnail: "https://i.ytimg.com/vi/E5RjzSK0fvY/mqdefault.jpg" },
      { youtubeId: "nk2CQITm_eo", title: "Logistic Regression Explained", order: 4, duration: 2400, thumbnail: "https://i.ytimg.com/vi/nk2CQITm_eo/mqdefault.jpg" },
      { youtubeId: "PkLHl8CE9Es", title: "Decision Trees & Random Forests", order: 5, duration: 3000, thumbnail: "https://i.ytimg.com/vi/PkLHl8CE9Es/mqdefault.jpg" },
    ]
  },
  {
    title: "Full Stack Web Development - MERN Stack",
    description: "Build complete full-stack applications with MongoDB, Express, React and Node.js. Covers REST APIs, authentication, deployment, and real-world project building.",
    category: "Web Development",
    difficulty: "Intermediate",
    instructor: "Traversy Media",
    youtubePlaylistId: "PLillGF-RfqbbiTGgA77tGO426V3hRF9iE",
    thumbnail: "https://i.ytimg.com/vi/7CqJlxBYj-M/hqdefault.jpg",
    tags: ["mern", "react", "nodejs", "mongodb", "express", "fullstack"],
    totalDuration: 90000,
    enrolledCount: 3200,
    videos: [
      { youtubeId: "7CqJlxBYj-M", title: "MERN Stack Front To Back", order: 1, duration: 2100, thumbnail: "https://i.ytimg.com/vi/7CqJlxBYj-M/mqdefault.jpg" },
      { youtubeId: "I7EDAR2-RaM", title: "Setting Up Express & MongoDB", order: 2, duration: 2400, thumbnail: "https://i.ytimg.com/vi/I7EDAR2-RaM/mqdefault.jpg" },
      { youtubeId: "BDo1lgaZuII", title: "Building REST APIs with Express", order: 3, duration: 3000, thumbnail: "https://i.ytimg.com/vi/BDo1lgaZuII/mqdefault.jpg" },
      { youtubeId: "Ke90Tje7VS0", title: "React Frontend - Components & State", order: 4, duration: 2700, thumbnail: "https://i.ytimg.com/vi/Ke90Tje7VS0/mqdefault.jpg" },
      { youtubeId: "enopDSs3DRw", title: "JWT Authentication - Login & Register", order: 5, duration: 3300, thumbnail: "https://i.ytimg.com/vi/enopDSs3DRw/mqdefault.jpg" },
    ]
  },
  {
    title: "System Design for SDE Interviews",
    description: "Master system design for top tech company interviews. Learn how to design scalable systems like Twitter, YouTube, WhatsApp. Covers load balancing, caching, databases, and microservices.",
    category: "System Design",
    difficulty: "Advanced",
    instructor: "Gaurav Sen",
    youtubePlaylistId: "PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX",
    thumbnail: "https://i.ytimg.com/vi/xpDnVSmNFX0/hqdefault.jpg",
    tags: ["system design", "scalability", "microservices", "interview", "architecture"],
    totalDuration: 86400,
    enrolledCount: 987,
    videos: [
      { youtubeId: "xpDnVSmNFX0", title: "Introduction to System Design", order: 1, duration: 1980, thumbnail: "https://i.ytimg.com/vi/xpDnVSmNFX0/mqdefault.jpg" },
      { youtubeId: "quLrc3PbuIw", title: "What is a Load Balancer?", order: 2, duration: 1620, thumbnail: "https://i.ytimg.com/vi/quLrc3PbuIw/mqdefault.jpg" },
      { youtubeId: "U3RkDLtS7uY", title: "Database Sharding Explained", order: 3, duration: 1800, thumbnail: "https://i.ytimg.com/vi/U3RkDLtS7uY/mqdefault.jpg" },
      { youtubeId: "RlkCdM_f3p4", title: "Caching Strategies - Redis & CDN", order: 4, duration: 2100, thumbnail: "https://i.ytimg.com/vi/RlkCdM_f3p4/mqdefault.jpg" },
      { youtubeId: "tndzLznxq40", title: "Microservices vs Monolith", order: 5, duration: 1740, thumbnail: "https://i.ytimg.com/vi/tndzLznxq40/mqdefault.jpg" },
      { youtubeId: "vvhC64hQZMk", title: "Design Twitter - System Design Interview", order: 6, duration: 2400, thumbnail: "https://i.ytimg.com/vi/vvhC64hQZMk/mqdefault.jpg" },
    ]
  },
  {
    title: "DevOps & Docker for Developers",
    description: "Learn Docker, Kubernetes, CI/CD pipelines, and modern DevOps practices. Build, ship and run applications anywhere with containers.",
    category: "DevOps",
    difficulty: "Intermediate",
    instructor: "TechWorld with Nana",
    youtubePlaylistId: "PLy7NryhiMmOgXl2p6wJMcVKAQfTUyBe7u",
    thumbnail: "https://i.ytimg.com/vi/3c-iBn73dDE/hqdefault.jpg",
    tags: ["docker", "kubernetes", "devops", "ci-cd", "containers"],
    totalDuration: 79200,
    enrolledCount: 743,
    videos: [
      { youtubeId: "3c-iBn73dDE", title: "Docker Tutorial for Beginners", order: 1, duration: 10800, thumbnail: "https://i.ytimg.com/vi/3c-iBn73dDE/mqdefault.jpg" },
      { youtubeId: "X48VuDVv0do", title: "Kubernetes Tutorial - Full Course", order: 2, duration: 14400, thumbnail: "https://i.ytimg.com/vi/X48VuDVv0do/mqdefault.jpg" },
      { youtubeId: "1eVy_iWrc20", title: "CI/CD Pipeline with Jenkins", order: 3, duration: 7200, thumbnail: "https://i.ytimg.com/vi/1eVy_iWrc20/mqdefault.jpg" },
      { youtubeId: "MyvdzrBDa1s", title: "GitHub Actions for CI/CD", order: 4, duration: 5400, thumbnail: "https://i.ytimg.com/vi/MyvdzrBDa1s/mqdefault.jpg" },
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('🗑️  Cleared existing courses');

    // Insert sample courses
    const inserted = await Course.insertMany(sampleCourses);
    console.log(`✅ Inserted ${inserted.length} sample courses`);

    console.log('\n📚 Seeded courses:');
    inserted.forEach(c => console.log(`  - ${c.title} (${c.category})`));

    console.log('\n🎉 Database seeded successfully!');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
