# Fullstack Todo List Application

This project has been restructured into a professional separate-directory structure to support separate deployment and development:
- **`frontend/`**: React + Vite + Tailwind CSS SPA, optimized for deployment on **Vercel**.
- **`backend/`**: Node.js + Express + MongoDB REST API, optimized for deployment on **Render**.

---

## Folder Structure

```text
d:\React\
├── package.json               # Root monorepo scripts for dev execution
├── README.md                  # Root instructions (this file)
├── frontend/                  # React front-end application
└── backend/                   # Express.js back-end server
```

---

## Local Setup & Development

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed.
- A running MongoDB instance (either local MongoDB Server or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier cluster).

### 2. Installation
From the root directory, run the following command to install dependencies for the root, frontend, and backend projects:
```bash
npm run install:all
```

### 3. Environment Setup
#### Backend
Create a `.env` file in the `backend/` directory (see `backend/.env.example` as a template):
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
```

#### Frontend
Create a `.env.development` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Running the Application Locally
To start both the frontend and backend servers concurrently, run:
```bash
npm run dev
```
- Frontend will run on: `http://localhost:5173`
- Backend API will run on: `http://localhost:5000`

---

## Deployment Guide

### Backend Deployment on Render

1. Sign up/Log in to [Render](https://render.com/).
2. Create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the following details in the creation form:
   - **Name**: `todo-list-backend` (or similar)
   - **Root Directory**: `backend` (CRITICAL: tells Render to run from the backend folder)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. In the **Environment** section, add the environment variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `your_mongodb_atlas_connection_string`
   - `JWT_SECRET` = `a_secure_random_string`
6. Deploy the Web Service and copy the generated service URL (e.g., `https://todo-list-backend.onrender.com`).

### Frontend Deployment on Vercel

1. Sign up/Log in to [Vercel](https://vercel.com/).
2. Click **Add New** > **Project** and import your GitHub repository.
3. In the project configuration:
   - **Root Directory**: `frontend` (CRITICAL: tells Vercel to run from the frontend folder)
   - **Framework Preset**: `Vite`
4. Expand **Environment Variables** and add:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api` (the URL of your Render backend web service with `/api` appended)
5. Click **Deploy**. Vercel will automatically build and deploy your React frontend.
