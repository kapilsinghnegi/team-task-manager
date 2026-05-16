# Team Task Manager

A full-stack collaborative team task management application built using the MERN stack.
The platform allows teams to create projects, manage members, assign tasks, track progress, and monitor project productivity through an interactive dashboard.

Inspired by tools like Trello and Asana.

## Features

### Authentication & Authorization

- User Signup & Login
- JWT Authentication
- Secure HTTP-only cookies
- Protected Routes
- Role-Based Access Control (Admin / Member)

### Project Management

- Create Projects
- Add / Remove Team Members
- Project-Based Task Organization
- Multiple Project Support

### Task Management

- Create Tasks
- Assign Tasks to Team Members
- Task Priorities
  - Low
  - Medium
  - High
- Task Status Tracking
  - Todo
  - In Progress
  - Done
- Due Dates
- Overdue Task Tracking

### Dashboard & Analytics

- Total Tasks
- Tasks by Status
- Overdue Tasks
- Project Overview
- Team Collaboration Dashboard

### UI/UX

- Responsive Design
- Modern Dashboard UI
- Sidebar Navigation
- Toast Notifications
- Clean Component Architecture

## Tech Stack

### Frontend

- React.js
- Vite
- Redux Toolkit
- Tailwind CSS v4
- shadcn/ui
- Axios
- React Router DOM

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Express Validator

## Project Structure

### Server

server/
│
├── src/
│ ├── config/
│ ├── controllers/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ └── app.js
│
├── server.js
└── package.json

### Client

client/
│
├── src/
│ ├── components/
│ ├── features/
│ ├── layouts/
│ ├── store/
│ ├── utils/
│ └── App.jsx
│
└── package.json

## Local Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

### 2. Setup Backend

```bash
cd server
npm install
cp .env.example .env
```

Fill in the required environment variables in the `.env` file. Then, run the following command to start the backend server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
cp .env.example .env
```

Fill in the required environment variables in the `.env` file. Then, run the following command to start the frontend development server:

```bash
npm run dev
```

## API Routes

### Auth Routes

```http
POST /api/auth/signup
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout
```

### Project Routes

```http
POST   /api/projects
GET    /api/projects
PATCH  /api/projects/:projectId
DELETE /api/projects/:projectId
```

### Task Routes

```http
POST   /api/tasks/project/:projectId
GET    /api/tasks/project/:projectId
PATCH  /api/tasks/:taskId
DELETE /api/tasks/:taskId
```

## Deployment

### Backend Deployment

#### 1. Push code to GitHub

Make sure your updated backend code is pushed to GitHub.

#### 2. Create Railway Project

- Login with your GitHub account.
- Click New Project
- Select Deploy from GitHub Repo
- Choose backend repository/folder - server

#### 3. Add Environment Variables

Add the following environment variables to your Railway Project:

```env
PORT
MONGO_URI
JWT_SECRET
COOKIE_EXPIRES_IN
CLIENT_URL
```

### 4. Start Command

Railway usually auto-detects Node.js. If needed:

```bash
npm start
```

### Frontend Deployment

#### 1. Create New Railway Project

Deploy frontend repository/folder - client.

#### 2. Add Environment Variables

Add the following environment variables to your Railway Project:

```env
VITE_API_URL
```

### 3. Build Settings

Railway auto-detects Vite. If needed:

```bash
npm run build
```

## Future Improvements

- Add User Profiles
- Add Task Comments
- Add Task Attachments
- Add Task Labels
