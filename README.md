# 📋 Team Task Manager

A full-stack collaborative task management 
web application where teams can manage 
projects and tasks efficiently.

---

## 🌐 Live Application

| Service | URL |
|---------|-----|
| **Frontend** | https://team-task-manager-reposit-opal.vercel.app/login |
| **Backend API** | https://your-backend.onrender.com |

---

## ✅ Features

- User Signup and Login with JWT Auth
- Create and manage Projects
- Add members to Projects
- Create Tasks with Title, Description,
  Due Date and Priority
- Assign Tasks to team members
- Update Task status (To Do / In Progress / Done)
- Dashboard with task statistics
- Role-Based Access (Admin and Member)
- Overdue task tracking
- Error handling and validations

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Deployed on: Vercel

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Deployed on: Render

### Database
- MongoDB Atlas (Cloud)

---

## 📁 Project Structure

📦 Team Task Manager

📁 Backend
├── 📂 models
│   ├── User.js
│   ├── Project.js
│   └── Task.js
│
├── 📂 routes
│   ├── auth.js
│   ├── projects.js
│   └── tasks.js
│
├── 📂 middleware
│   └── auth.js
│
├── .env
├── server.js
└── package.json


💻 Frontend
├── 📂 src
│   ├── 📂 pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Projects.jsx
│   │   └── Tasks.jsx
│   │
│   ├── 📂 components
│   ├── App.jsx
│   └── main.jsx
│
└── package.json

---

## ⚙️ Local Setup Instructions

### Requirements
- Node.js (v16 or above)
- MongoDB Atlas account
- Git

### Step 1 — Clone Repository
```bash
git clone https://github.com/nagula-vyshnavi/team-task-manager.git
cd team-task-manager
```

### Step 2 — Setup Backend
```bash
cd backend
npm install
```

Create `.env` file inside backend folder:

MONGO_URI=mongodb+srv://nagulavyshnavi608_db_user:Dgr1NVY4IMuGe7Zb@cluster0.b5bxvhn.mongodb.net/team_task_manager?retryWrites=true&w=majority
JWT_SECRET=mysecretkey123
PORT=10000
         
         Run backend:
```bash
node server.js
```

Backend runs at: http://localhost:5000

### Step 3 — Setup Frontend
```bash
cd ../frontend
npm install
```

Create `.env` file inside frontend folder:

REACT_APP_API_URL=http://localhost:5000

Run frontend:
```bash
npm start
```

Frontend runs at: http://localhost:3000

---

## 🚀 Deployment Guide

### Backend — Render

1. Go to render.com and login with GitHub
2. Click New + → Web Service
3. Connect your GitHub repository
4. Set Root Directory: `backend`
5. Set Build Command: `npm install`
6. Set Start Command: `node server.js`
7. Add Environment Variables:
   - MONGO_URI = your mongodb url
   - JWT_SECRET = mysecretkey123
   - PORT = 5000
8. Click Deploy
9. Copy the backend URL

### Frontend — Vercel

1. Go to vercel.com and login with GitHub
2. Click New Project → Import repo
3. Set Root Directory: `frontend`
4. Set Build Command: `npm run build`
5. Set Output Directory: `build`
6. Add Environment Variable:
   - REACT_APP_API_URL = your render backend URL
7. Click Deploy
8. Copy the frontend URL

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/projects | Create project |
| GET | /api/projects | Get all projects |
| GET | /api/projects/:id | Get single project |
| POST | /api/projects/:id/members | Add member |
| DELETE | /api/projects/:id/members/:userId | Remove member |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/tasks | Create task |
| GET | /api/tasks/project/:id | Get project tasks |
| GET | /api/tasks/my | Get my tasks |
| PUT | /api/tasks/:id/status | Update task status |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/tasks/dashboard/:id | Get stats |

---

## 👩‍💻 Developer

**Nagula Vyshnavi**

- 📧 Email: nagulavyshnavi608@gmail.com
- 💼 LinkedIn: linkedin.com/in/vyshnavi-nagula-972748278
- 🐙 GitHub: github.com/nagula-vyshnavi
