# Task Management Web Application

A production-ready task management application built with Next.js 15, Flask, and Supabase.

## 🚀 Features

- **Google OAuth 2.0**: Secure login using Gmail accounts.
- **Task Management**: CRUD operations for tasks with status tracking.
- **Task Assignment**: Assign tasks to other registered users.
- **Email Notifications**: Automated notifications for task creation and completion via Gmail SMTP.
- **Dashboard**: Real-time stats on task progress.
- **Responsive UI**: Clean and modern interface built with Tailwind CSS.

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, React Hook Form, Axios.
- **Backend**: Flask (Python), SQLAlchemy, Flask-JWT-Extended, Flask-CORS.
- **Database**: Supabase PostgreSQL.
- **Auth**: Google OAuth 2.0.
- **Email**: Gmail SMTP.

## 🏗 Architecture Diagram

```ascii
+-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |
|   Next.js 15      | <---> |   Flask API       | <---> |   Supabase DB     |
|   (Frontend)      |       |   (Backend)       |       |   (PostgreSQL)    |
|                   |       |                   |       |                   |
+---------+---------+       +---------+---------+       +-------------------+
          |                           |
          v                           v
+---------+---------+       +---------+---------+
|                   |       |                   |
|   Google OAuth    |       |   Gmail SMTP      |
|   (Auth)          |       |   (Email)         |
|                   |       |                   |
+-------------------+       +-------------------+
```

## 📋 Database Schema

### Users Table
- `id`: Serial, Primary Key
- `google_id`: String, Unique
- `name`: String
- `email`: String, Unique (Gmail only)
- `avatar_url`: String
- `created_at`: DateTime

### Tasks Table
- `id`: Serial, Primary Key
- `title`: String
- `description`: Text
- `status`: String (pending/completed)
- `created_by`: Foreign Key (Users.id)
- `assigned_to`: Foreign Key (Users.id)
- `created_at`: DateTime
- `updated_at`: DateTime

## 🚦 Setup Instructions

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Create a `.env` file based on `.env.example` and fill in the values.
6. Run the server: `python run.py`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env.local` file based on `.env.example` and fill in the values.
4. Run the development server: `npm run dev`

## 🔌 API Documentation

### Auth
- `POST /auth/google`: Login with Google token.
- `GET /auth/me`: Get current user details.

### Users
- `GET /users`: List all users (supports `?search=` filter).

### Tasks
- `GET /tasks`: List tasks (supports `?filter=all|assigned_to_me|created_by_me`).
- `POST /tasks`: Create a new task.
- `PUT /tasks/:id`: Update task details.
- `DELETE /tasks/:id`: Delete a task.
- `PATCH /tasks/:id/complete`: Mark task as completed.

## 🚢 Deployment

### Frontend (Vercel)
- Push code to GitHub.
- Connect repository to Vercel.
- Configure environment variables in Vercel Dashboard.

### Backend (Railway/Render)
- Push code to GitHub.
- Connect repository to Railway or Render.
- Add `requirements.txt` and use `gunicorn backend.run:app` as start command.
- Configure environment variables.

### Database (Supabase)
- Create a new project on Supabase.
- Copy the Connection String and set it as `DATABASE_URL` in the backend.
