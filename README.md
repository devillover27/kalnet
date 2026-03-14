# KALNET - Learning Management System

A modern, full-stack Learning Management System built with React, TypeScript, and Node.js.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Students
- 📚 Browse and enroll in courses
- 🎯 Track learning progress with study history
- 🏆 Competitive leaderboard rankings
- 🔥 Streak tracking for consistent learning
- 👤 Personal profile management
- 📊 Personalized dashboard

### For Educators
- 📝 Create and manage courses
- 👥 Monitor student progress and analytics
- 📈 Detailed analytics and reporting
- 🎓 Student management and tracking
- ✏️ Edit course content anytime

### General Features
- 🔐 Secure authentication system
- 📱 Responsive design
- ⚡ Fast and optimized performance
- 🎨 Modern UI with TypeScript

## 🛠️ Tech Stack

### Frontend
- **React** 18+ with TypeScript
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** with Express
- **Prisma** - Modern ORM for database management
- **SQLite/PostgreSQL** - Database (configured in Prisma)
- **JWT** - Authentication tokens

### Development Tools
- **TypeScript** - Type-safe development
- **Vite** - Fast development server and build

## 📁 Project Structure

```
lms-website/
├── frontend/
│   ├── src/
│   │   ├── api/              # API service layer
│   │   ├── components/       # React components
│   │   │   └── layout/      # Layout components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   │   ├── educator/    # Educator pages
│   │   │   └── student/     # Student pages
│   │   ├── router/          # Routing configuration
│   │   ├── store/           # State management (Zustand)
│   │   ├── styles/          # Global styles
│   │   ├── types/           # TypeScript types
│   │   └── lib/             # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── index.js         # Server entry point
│   │   ├── middleware/      # Express middleware
│   │   └── routes/          # API routes
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
├── README.md
├── package.json
└── tsconfig.json
```

## 🚀 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/devillover27/kalnet.git
   cd kalnet
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Setup environment variables**
   - Create `.env` in the server directory
   - Configure database URL and JWT secret
   ```env
   DATABASE_URL="sqlite:./dev.db"
   JWT_SECRET="your-secret-key"
   PORT=3000
   ```

5. **Setup database**
   ```bash
   cd server
   npx prisma migrate dev --name init
   npx prisma generate
   ```

## 📱 Usage

### Development

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend development server** (in another terminal)
   ```bash
   npm run dev
   ```

3. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

1. **Frontend**
   ```bash
   npm run build
   ```

2. **Backend** - Set appropriate environment variables and run server in production mode
   ```bash
   cd server
   npm run build
   npm start
   ```

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Courses Endpoints
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Student Endpoints
- `GET /api/student/profile` - Get student profile
- `POST /api/student/enroll` - Enroll in course
- `GET /api/student/courses` - Get enrolled courses

### Analytics Endpoints
- `GET /api/analytics/dashboard` - Get analytics dashboard
- `GET /api/analytics/students` - Get student analytics

### Leaderboard Endpoints
- `GET /api/leaderboard` - Get leaderboard rankings

## 👥 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 📧 Contact

For questions and support, please reach out to the project maintainer at [devillover27](https://github.com/devillover27).

---

**Happy Learning! 🎓**