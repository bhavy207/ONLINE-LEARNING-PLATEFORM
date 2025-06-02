# PORTFOLIO WEBSITE WITH ADVANCED ANIMATIONS

*COMPANY*: CODTECH IT SOLUTIONS

*NAME*: BHAVY MANGUKIYA

*INTERN ID*: CT04DM87

*DOMAIN* : WEB DEVELOPER

*DURATION*: 4 WEEKS

*MENTOR*: NEELA SANTOSH

A comprehensive online learning platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that supports video lessons, quizzes, and progress tracking.

## Features

- User Authentication (Student/Instructor roles)
- Video Lessons with streaming capabilities
- Interactive Quizzes
- Progress Tracking
- Course Management
- Responsive and Student-friendly UI

## Tech Stack

- Frontend: React.js, Material-UI
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Video Streaming: AWS S3 or similar service
- Authentication: JWT

## Project Structure

```
online-learning-platform/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd ../client
   npm start
   ```

## Environment Variables

Create a `.env` file in the server directory with the following variables:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `PORT`: Backend server port (default: 5000)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 
