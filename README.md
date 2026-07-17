# LearnPath AI

**One Prompt. Whole Learning.**

LearnPath AI is a full-stack AI learning SaaS that turns a single learning goal into a structured, personalized learning path with modules, lessons, resources, quizzes, projects, interview preparation, and analytics.

The product flow is intentionally complete: users land on a premium launch screen, authenticate, create a learning profile, see an honest empty dashboard, generate their first course, and continue into a learning dashboard.

## Product Flow

```text
App Launch
  -> Minimal Landing Screen
  -> Begin Learning
  -> Login / Sign Up
  -> Authentication
  -> First-Time Profile Creation
  -> Home Dashboard
  -> Generate Course
  -> Learning Dashboard
```

New users do not see fake metrics. Until a course is generated, the dashboard shows `0%` progress, `0` completed lessons, `0 Days` streak, `0` completed projects, and `Not Available` interview readiness.

## Features

- Premium React interface with glassmorphism, gradients, Framer Motion transitions, and responsive layouts.
- Custom LearnPath AI branding across landing, auth, profile, dashboard, sidebar, loading states, and favicon-ready logo assets.
- JWT authentication with protected profile and course APIs.
- First-time profile setup for name, learning goal, role, skill level, study time, learning style, target date, and favorite technologies.
- Structured course generation with modules, lessons, resources, quizzes, projects, interview questions, and analytics.
- Relational persistence with SQLAlchemy models for courses, modules, lessons, resources, quizzes, questions, projects, interview prep, analytics, and progress.
- Empty-state dashboard that unlocks analytics only after the first course exists.
- API client with token injection and normalized course responses for the frontend.

## Tech Stack

**Frontend**

- React
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- Lucide React
- Recharts

**Backend**

- FastAPI
- SQLAlchemy
- Pydantic
- SQLite
- JWT authentication
- Passlib bcrypt password hashing
- LangChain / Groq-ready service layer
- ChromaDB dependency support

## Project Structure

```text
LearnAI/
  backend/
    api/
      routes/
      v1/
    config/
    database/
    models/
    schemas/
    services/
    main.py
    requirements.txt
  src/
    components/
    lib/
    services/
    App.jsx
    main.jsx
    styles.css
  testing/
    api_tests/
    backend_tests/
  docs/
  package.json
  vite.config.js
  README.md
```

## Getting Started

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Create Backend Environment

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

On macOS/Linux, activate with:

```bash
source .venv/bin/activate
```

### 3. Configure Environment Variables

Create a `.env` file in the project root or backend environment with:

```env
SECRET_KEY=change-this-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=sqlite:///./learnpath.db
GROQ_API_KEY=your-groq-api-key
```

The course service is schema-safe and can run without an external AI key. Add `GROQ_API_KEY` when connecting a live model-backed generation pipeline.

### 4. Run Backend

From the project root:

```bash
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

FastAPI will be available at:

- API: `http://127.0.0.1:8000`
- Docs: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/health`

### 5. Run Frontend

In another terminal from the project root:

```bash
npm run dev
```

Vite will start the app at:

```text
http://127.0.0.1:5173
```

The Vite dev server proxies `/api` requests to the FastAPI backend.

## Core API Routes

```text
POST /api/v1/auth/register
POST /api/v1/auth/login

GET  /api/v1/users/profile
POST /api/v1/users/profile

POST /api/v1/courses/generate
GET  /api/v1/courses/current
GET  /api/v1/courses/{course_id}

GET  /health
```

## Course Data Model

Generated courses are stored relationally:

```text
Course
  -> CourseModule
    -> Lesson
    -> Resource
    -> Quiz
      -> Question
  -> CourseProject
  -> InterviewQuestion
  -> LearningAnalytics
  -> Progress
```

This gives the product a real backend foundation instead of keeping the learning path as a single temporary frontend object.

## Scripts

```bash
npm run dev       # Start Vite development server
npm run build     # Build production frontend
npm run preview   # Preview production build
```

Backend tests:

```bash
python -m pytest testing/backend_tests
```

API tests:

```bash
python -m pytest testing/api_tests
```

## Design Direction

LearnPath AI uses a premium AI startup visual style inspired by Apple, Linear, Perplexity, Framer, Notion AI, Arc, Vercel, and Cursor:

- Indigo, violet, purple, cyan, emerald, pink, and yellow accents.
- Soft animated gradient backgrounds.
- Glassmorphism cards and navigation.
- Framer Motion page transitions and micro-interactions.
- Honest empty states for new users.
- Large but restrained typography.
- Responsive layouts for desktop, tablet, and mobile.

## Deployment Notes

For production:

- Replace wildcard CORS with the deployed frontend domain.
- Use a strong `SECRET_KEY`.
- Move from SQLite to Postgres.
- Run database migrations with Alembic.
- Store secrets in the hosting provider's environment manager.
- Serve the Vite build behind a CDN or app platform.
- Run FastAPI behind a production ASGI server such as Uvicorn/Gunicorn.

## Team

Built by **AI Mavericks Team**.
