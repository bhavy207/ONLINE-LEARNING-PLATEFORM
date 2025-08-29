# 🎓 LearnHub - Online Learning Platform

A complete MERN stack online learning platform with course management, user authentication, video lessons, and progress tracking.

## ✨ Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access (Student, Instructor, Admin)
  - Secure password hashing with bcrypt

- **Course Management**
  - Create, update, and delete courses
  - Video lessons with progress tracking
  - Course categories and difficulty levels
  - Course search and filtering

- **Learning Experience**
  - Interactive video player
  - Lesson completion tracking
  - Progress visualization
  - Course enrollment system

- **Dashboard & Analytics**
  - Personalized student dashboard
  - Instructor course management
  - Admin panel for platform management
  - Progress tracking and statistics

- **Responsive Design**
  - Modern, mobile-first design
  - Beautiful gradient UI
  - Smooth animations and transitions

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **CSS3** - Styling with modern features

## 📁 Project Structure

```
learning-platform/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Progress.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── courses.js
│   │   └── progress.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── package.json
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── CourseCard.jsx
    │   │   ├── VideoPlayer.jsx
    │   │   └── ProgressBar.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Courses.jsx
    │   │   ├── CourseDetail.jsx
    │   │   └── AdminPanel.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd learning-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/learning-platform
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
PORT=5000
```

Start the backend server:
```bash
npm run dev
```

Backend will run on: http://localhost:5000

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Start the frontend development server:
```bash
npm run dex
```

Frontend will run on: http://localhost:5173

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses (with filters)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (instructor/admin)
- `PUT /api/courses/:id` - Update course
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/enrolled/me` - Get user's enrolled courses

### Progress
- `GET /api/progress/:courseId` - Get course progress
- `POST /api/progress/:courseId/lesson/:lessonId` - Mark lesson complete

## 👥 User Roles

### Student
- Browse and search courses
- Enroll in courses
- Track learning progress
- View personal dashboard

### Instructor
- Create and manage courses
- Add lessons and content
- View student enrollment
- Access instructor dashboard

### Admin
- Full platform access
- Manage all courses
- User management capabilities
- Platform analytics

## 🎯 Demo Accounts

For testing purposes, you can create demo accounts:

**Student Account:**
- Email: student@demo.com
- Password: password123

**Instructor Account:**
- Email: instructor@demo.com  
- Password: password123

**Admin Account:**
- Email: admin@demo.com
- Password: password123

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/learning-platform
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
PORT=5000
```

## 📱 Features Overview

### Home Page
- Hero section with call-to-action
- Featured courses display
- Platform benefits showcase

### Authentication
- Secure login/register forms
- JWT token management
- Role-based redirects

### Course Management
- Rich course creation forms
- Lesson management
- Video upload support
- Progress tracking

### Student Experience
- Course browsing with filters
- Video learning interface
- Progress visualization
- Personal dashboard

### Instructor Tools
- Course creation wizard
- Student progress monitoring
- Content management

## 🎨 Styling

The platform uses a modern design with:
- Gradient backgrounds
- Card-based layouts
- Smooth animations
- Mobile-responsive design
- Professional color scheme

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Route protection
- Input validation
- CORS configuration

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Deploy to services like Heroku, Railway, or DigitalOcean
3. Update CORS settings for production domain

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to services like Netlify, Vercel, or AWS S3
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern MERN stack technologies
- Responsive design inspired by modern learning platforms
- Icons and emojis for enhanced user experience

---

**Happy Learning! 🎓**
