# TaskFlow - Fullstack Todo List Application

TaskFlow is a professional full-stack Todo application designed with clean architecture, modern aesthetics, responsive layout, and robust state management.

The repository is structured as a clean monorepo containing two self-contained packages:
- **[frontend](file:///d:/Projects/Todo-List/frontend)**: A React SPA powered by Vite, Tailwind CSS (v4), and Lucide icons.
- **[backend](file:///d:/Projects/Todo-List/backend)**: An Express.js REST API with dual-database support (Supabase PostgreSQL with fallback to local JSON file).

---

## Repository Structure

```text
Todo-List/
├── frontend/                  # React + Vite client application
│   ├── src/
│   │   ├── components/        # UI components (auth, layout, todo, ui)
│   │   ├── context/           # React Context (Auth, Todo)
│   │   ├── hooks/             # Custom React Hooks (useTodos)
│   │   └── main.jsx           # App entry point
│   ├── package.json           # Frontend scripts & dependencies
│   └── vite.config.js         # Vite bundler configuration
│
└── backend/                   # Node.js + Express API server
    ├── config/                # Configuration (Supabase)
    ├── data/                  # Local db storage fallback (db.json)
    ├── middleware/            # Express middleware (auth protection)
    ├── routes/                # API route endpoints (auth, todos)
    ├── services/              # Database service mapping layer
    ├── server.js              # Server entry point
    └── package.json           # Backend scripts & dependencies
```

---

## Features

### Frontend (React SPA)
- **Sleek Single-Column UI**: Beautiful centered cards with subtle backdrop blur, gradients, hover micro-animations, and full responsiveness.
- **Theme Support**: Seamless system-wide light & dark mode toggle.
- **Optimistic Updates**: Task creation, deletion, and status toggling update the UI instantly, rolling back state gracefully on network failure.
- **Validation**: Inline registration feedback (email regex, password length check, confirm password verification) and standard login checks.
- **Stats Dashboard**: Live counter cards for Total, Active, Completed, and Overdue tasks.
- **Search & Filters**: Search-in-page and tab-based status filters (All, Active, Completed), along with category filters (All, Today, High Priority, Completed).

### Backend (Express REST API)
- **Token-based Authentication**: JWT authentication for user register/login and profile retrieval (`/api/auth/me`).
- **Database Fallback**: Integrates with **Supabase (PostgreSQL)** if configured via environment variables. If configuration is missing, it transparently falls back to a local JSON file (`backend/data/db.json`) for seamless offline operation.
- **Google OAuth Integration**: Backend-level verification of Supabase Google access tokens.

---

## Local Setup & Installation

### 1. Prerequisites
- **Node.js** (v16+) installed.

### 2. Environment Setup

#### Backend Environment Configuration
Create a `.env` file inside the `backend/` directory using `backend/.env.example` as a template:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here

# (Optional) Supabase Database configurations
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

#### Frontend Environment Configuration
Create a `.env.development` file inside the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running the Application

Because the root configuration files were removed to maintain a strict two-folder workspace, the frontend and backend run as independent Node.js processes.

### 1. Start the Backend API Server
In a terminal window:
```bash
cd backend
npm install
npm run dev
```
The backend API server will start on: `http://localhost:5000`

### 2. Start the Frontend Client
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
The React development server will start on: `http://localhost:5173`

---

## Deployment

### 1. Backend Deployment (e.g. on Render)
- Connect your GitHub repository to Render and create a **Web Service**.
- Set **Root Directory** to `backend`.
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- Add environment variables (`JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` if using Supabase).

### 2. Frontend Deployment (e.g. on Vercel)
- Import your repository on Vercel and create a project.
- Set **Root Directory** to `frontend`.
- Set **Framework Preset** to `Vite`.
- Add the **Environment Variable** `VITE_API_URL` pointing to your deployed backend URL (e.g. `https://your-api.onrender.com/api`).
