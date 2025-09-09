# Alumni Interaction Portal

A comprehensive web application that facilitates interaction between alumni and current students through a job board system. Alumni can post job opportunities, and students can apply for these positions, creating a bridge between the academic and professional worlds.

## 🌟 Features

### For Alumni
- **Dashboard**: Overview of posted jobs and applications received
- **Job Management**: Create, edit, and manage job postings
- **Application Review**: View and manage student applications
- **Notifications**: Real-time notifications for new applications
- **Profile Management**: Update personal information

### For Students
- **Job Discovery**: Browse available job opportunities
- **Application System**: Apply for jobs with resume upload
- **Application Tracking**: Monitor application status
- **Notifications**: Receive updates on application status
- **Profile Management**: Update personal information

### General Features
- **Authentication**: Secure login/registration system
- **Role-based Access**: Different interfaces for alumni and students
- **Real-time Notifications**: Instant updates for important events
- **File Upload**: Resume upload functionality
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT tokens
- **File Upload**: Multer for resume handling
- **Security**: bcryptjs for password hashing

### Frontend (React)
- **Framework**: React 18
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern design principles
- **State Management**: React Class Components

## 📁 Project Structure

```
AlumniInteractionPortal/
├── backend/
│   ├── src/
│   │   ├── controllers/          # (Empty - logic in routes)
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.js          # Authentication routes
│   │   │   ├── jobs.js          # Job management routes
│   │   │   ├── applications.js  # Application handling routes
│   │   │   ├── notifications.js # Notification system routes
│   │   │   └── users.js         # User profile routes
│   │   └── index.js             # Main server file
│   ├── uploads/
│   │   └── resumes/             # Resume file storage
│   └── database.sqlite          # SQLite database
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlumniApplications/  # Alumni application management
│   │   │   ├── AlumniDashboard/     # Alumni main dashboard
│   │   │   ├── Applications/        # Application listing
│   │   │   ├── ApplyJob/            # Job application form
│   │   │   ├── EditJob/             # Job editing interface
│   │   │   ├── Header/              # Navigation header
│   │   │   ├── JobDetails/          # Job detail view
│   │   │   ├── Login/               # Login form
│   │   │   ├── Notifications/       # Notification center
│   │   │   ├── PostJob/             # Job posting form
│   │   │   ├── Profile/             # User profile management
│   │   │   ├── Register/            # Registration form
│   │   │   ├── Sidebar/             # Navigation sidebar
│   │   │   └── StudentDashboard/    # Student main dashboard
│   │   ├── routes/
│   │   │   └── AppRoutes.js         # Application routing
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── styles/
│   │   │   └── global.css           # Global styles
│   │   └── utils/
│   │       └── history.js           # Browser history utility
│   └── public/
│       └── index.html
└── README.md
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,  -- 'alumni' or 'student'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Jobs Table
```sql
CREATE TABLE jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  stipend TEXT,
  alumni_id INTEGER NOT NULL,
  apply_by DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alumni_id) REFERENCES users (id)
);
```

### Applications Table
```sql
CREATE TABLE applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  resume_url TEXT NOT NULL,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending',  -- 'pending', 'accepted', 'rejected', 'shortlisted'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs (id),
  FOREIGN KEY (student_id) REFERENCES users (id)
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AlumniInteractionPortal
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create new job (Alumni only)
- `PUT /api/jobs/:id` - Update job (Alumni only)
- `DELETE /api/jobs/:id` - Delete job (Alumni only)

### Applications
- `POST /api/applications/:jobId` - Apply for job (Student only)
- `GET /api/applications/job/:jobId` - Get applications for job (Alumni only)
- `GET /api/applications/my-applications` - Get user's applications
- `PUT /api/applications/:id/status` - Update application status (Alumni only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🔐 Authentication Flow

1. **Registration**: Users register with name, email, password, and role
2. **Email Verification**: Registration redirects to login (no auto-login)
3. **Login**: Users authenticate with email and password
4. **JWT Token**: Successful login returns JWT token (24h expiry)
5. **Protected Routes**: All API endpoints require valid JWT token
6. **Role-based Access**: Different interfaces based on user role

## 🎨 User Interface

### Design Principles
- **Modern UI**: Clean, professional design
- **Responsive**: Mobile-first approach
- **Accessibility**: Proper contrast and keyboard navigation
- **User Experience**: Intuitive navigation and clear feedback

### Key Components
- **Header**: Navigation, notifications, user menu
- **Sidebar**: Alumni-specific navigation
- **Dashboard**: Role-specific overview
- **Forms**: Consistent styling and validation
- **Modals**: For confirmations and detailed views

## 🔔 Notification System

### Real-time Features
- **Polling**: Frontend checks for new notifications every 30 seconds
- **Badge Count**: Unread notification count in header
- **Dropdown**: Quick access to recent notifications
- **Auto-update**: Notifications refresh when dropdown opens

### Notification Types
- **New Application**: Alumni notified when student applies
- **Status Update**: Student notified when application status changes
- **System Messages**: General notifications and updates

## 📱 Responsive Design

### Breakpoints
- **Desktop**: Full sidebar and expanded layout
- **Tablet**: Collapsible sidebar
- **Mobile**: Stack layout with mobile-optimized navigation

### Mobile Features
- **Touch-friendly**: Large buttons and touch targets
- **Swipe Navigation**: Intuitive mobile interactions
- **Optimized Forms**: Mobile-friendly input fields

## 🛡️ Security Features

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Token Expiry**: 24-hour token expiration
- **Protected Routes**: All API endpoints require authentication

### File Upload
- **File Type Validation**: Only PDF files allowed for resumes
- **Size Limits**: 5MB maximum file size
- **Secure Storage**: Files stored in protected uploads directory

### Data Protection
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing

## 🧪 Testing

### Manual Testing
1. **Registration Flow**: Test user registration and email validation
2. **Login Flow**: Test authentication and role-based redirection
3. **Job Management**: Test job creation, editing, and deletion
4. **Application Process**: Test job application and status updates
5. **Notifications**: Test notification creation and management

### Test Scenarios
- **Alumni Workflow**: Register → Login → Post Job → Review Applications
- **Student Workflow**: Register → Login → Browse Jobs → Apply → Track Status
- **Cross-User Interaction**: Alumni posts job, student applies, notifications sent

## 🚀 Deployment

### Backend Deployment
1. Set up Node.js server
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start server: `npm start`

### Frontend Deployment
1. Build production version: `npm run build`
2. Serve static files from `build/` directory
3. Configure API endpoints for production

### Database
- SQLite database file included
- No additional database setup required
- Database auto-initializes on first run

## 🔧 Configuration

### Environment Variables
- `PORT`: Backend server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Environment (development/production)

### File Upload Configuration
- **Resume Directory**: `backend/uploads/resumes/`
- **Allowed Types**: PDF only
- **Max Size**: 5MB
- **Naming**: Timestamp + original filename

## 📈 Future Enhancements

### Planned Features
- **Email Notifications**: SMTP integration for email alerts
- **Advanced Search**: Filter jobs by location, company, etc.
- **File Management**: Resume versioning and management
- **Analytics**: Application and job statistics
- **Mobile App**: React Native mobile application

### Technical Improvements
- **Database Migration**: PostgreSQL for production
- **Caching**: Redis for improved performance
- **Testing**: Automated test suite
- **CI/CD**: Continuous integration and deployment
- **Monitoring**: Application performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Ashlesh Bathina** - Initial development and architecture

## 🙏 Acknowledgments

- React community for excellent documentation
- Express.js for robust backend framework
- SQLite for lightweight database solution
- All contributors and testers

---

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

**Happy Job Hunting! 🎯**
