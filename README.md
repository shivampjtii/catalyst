# 🎯 FocusLearn — Distraction-Free Tech Learning Platform

A full-stack MERN application for focused tech learning. Watch YouTube playlists, take AI-generated quizzes after each video, and track your progress — all without distractions.

---

## 🚀 Tech Stack

- **Frontend:** React 18, React Router v6, React Player, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **AI:** Anthropic Claude API (quiz generation)
- **Video:** YouTube Data API v3 + React Player (embedded)
- **Auth:** JWT + bcrypt

---

## 📁 Project Structure

```
focuslearn/
├── backend/
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express API routes
│   ├── middleware/     # Auth middleware
│   ├── seed.js         # Sample data seeder
│   ├── server.js       # Entry point
│   └── .env.example
└── frontend/
    └── src/
        ├── components/ # Navbar, CourseCard, QuizModal
        ├── context/    # AuthContext
        └── pages/      # Landing, Auth, Dashboard, Courses, Player, AddCourse
```

---

## ⚙️ Setup Instructions

### 1. Clone & Install

```bash
# Backend
cd focuslearn/backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/focuslearn
JWT_SECRET=your_super_secret_key_here

# Get from: https://console.cloud.google.com → YouTube Data API v3
YOUTUBE_API_KEY=your_youtube_api_key

# Get from: https://console.anthropic.com
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. Seed the Database (optional but recommended)

```bash
cd backend
node seed.js
```

This inserts 6 sample courses (JS, DSA, ML, MERN, System Design, DevOps).

### 4. Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm start
```

App runs at: **http://localhost:3000**  
API runs at: **http://localhost:5000**

---

## 🔑 Getting API Keys

### YouTube Data API v3
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → Enable **YouTube Data API v3**
3. Create credentials → **API Key**
4. Paste in `.env` as `YOUTUBE_API_KEY`

### Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create account → API Keys → New Key
3. Paste in `.env` as `ANTHROPIC_API_KEY`

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🔐 Auth | Register/Login with JWT |
| 📚 Courses | Browse & filter by category/difficulty |
| ▶️ Player | Embedded YouTube player (no distractions) |
| 🧠 AI Quiz | Claude generates 5 MCQs per video |
| 📊 Progress | Per-video & per-course tracking |
| ⚡ XP System | Earn XP for completing videos & quizzes |
| 🔥 Streaks | Daily learning streak tracking |
| ➕ Add Course | Import any YouTube playlist in 3 steps |
| 🎯 Focus Mode | Full-screen player, no sidebar |

---

## 📡 API Endpoints

```
POST   /api/auth/register          Register user
POST   /api/auth/login             Login user
GET    /api/auth/me                Get current user

GET    /api/courses                List courses (filter/search)
GET    /api/courses/:id            Get course details
POST   /api/courses                Create course
POST   /api/courses/enroll/:id     Enroll in course

GET    /api/progress/:courseId     Get progress
POST   /api/progress/complete-video   Mark video complete
POST   /api/progress/update-position  Save playback position
GET    /api/progress/dashboard/stats  Dashboard stats

POST   /api/quiz/generate          AI-generate quiz for video
POST   /api/quiz/submit            Submit quiz answers

GET    /api/youtube/playlist/:id   Import YouTube playlist
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#07070d` |
| Card | `#12121f` |
| Accent | `#6c63ff` |
| Accent 2 | `#00e5ff` |
| Font Display | Syne |
| Font Body | DM Sans |
