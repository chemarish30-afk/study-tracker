# Study Tracker CMS

A Strapi v4 backend for the Study Tracker application, ready for Strapi Cloud deployment.

## Features

- **Content Management**: Hierarchical content structure (ExamCourse → Subject → Unit → Chapter → Module → Content)
- **Student Management**: Student profiles, enrollments, study sessions, todos, and progress tracking
- **Authentication**: JWT-based authentication with Users & Permissions plugin
- **Email Integration**: Resend SMTP configuration for signup confirmation and password reset
- **Permissions**: Public access to content, authenticated access to student data

## Content Types

### Content Hierarchy
- **ExamCourse**: Exam courses (UPSC, TNPSC, NEET, etc.)
- **Subject**: Subjects within exam courses
- **Unit**: Units within subjects
- **Chapter**: Chapters within units
- **Module**: Modules within chapters
- **Content**: Learning content within modules

### Student Data
- **Student**: Student profiles with personal information
- **Enrollment**: Student enrollments in exam courses
- **StudySession**: Study session tracking
- **Todo**: Student todo items and tasks
- **Progress**: Progress tracking for content

## Setup

### Prerequisites
- Node.js 18.x or 20.x
- PostgreSQL database
- Resend account for email services

### Local Development

1. **Install dependencies**:
   ```bash
   cd cms
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Generate random keys
   APP_KEYS=key1,key2,key3,key4
   API_TOKEN_SALT=your_random_salt
   ADMIN_JWT_SECRET=your_admin_jwt_secret
   JWT_SECRET=your_jwt_secret
   TRANSFER_TOKEN_SALT=your_transfer_token_salt
   
   # Database
   DATABASE_URL=postgres://user:password@localhost:5432/study_tracker
   
   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key
   RESEND_FROM_EMAIL=your_verified_email@domain.com
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_USER=resend
   SMTP_PASSWORD=your_resend_api_key
   ```

3. **Start development server**:
   ```bash
   npm run develop
   ```

   The admin panel will be available at `http://localhost:1337/admin`

### Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm run start
   ```

## Strapi Cloud Deployment

This project is ready for Strapi Cloud deployment:

1. **Base Directory**: Set to `/cms` in Strapi Cloud
2. **Environment Variables**: Configure all required environment variables in Strapi Cloud dashboard
3. **Database**: Use the provided PostgreSQL connection string
4. **Email**: Configure Resend SMTP settings

### Required Environment Variables for Strapi Cloud

```env
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_random_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
JWT_SECRET=your_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
DATABASE_URL=postgres://user:password@host:5432/dbname?sslmode=require
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_email@domain.com
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=your_resend_api_key
```

## API Endpoints

### Public Endpoints (No Authentication Required)
- `GET /api/exam-courses` - List all exam courses
- `GET /api/exam-courses/:id` - Get exam course details
- `GET /api/subjects` - List all subjects
- `GET /api/subjects/:id` - Get subject details
- `GET /api/units` - List all units
- `GET /api/units/:id` - Get unit details
- `GET /api/chapters` - List all chapters
- `GET /api/chapters/:id` - Get chapter details
- `GET /api/modules` - List all modules
- `GET /api/modules/:id` - Get module details
- `GET /api/contents` - List all content
- `GET /api/contents/:id` - Get content details

### Authentication Endpoints
- `POST /api/auth/local/register` - Register new user
- `POST /api/auth/local` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Authenticated Endpoints (Require JWT Token)
- `GET /api/students` - List student profiles
- `POST /api/students` - Create student profile
- `PUT /api/students/:id` - Update student profile
- `GET /api/enrollments` - List enrollments
- `POST /api/enrollments` - Create enrollment
- `GET /api/study-sessions` - List study sessions
- `POST /api/study-sessions` - Create study session
- `GET /api/todos` - List todos
- `POST /api/todos` - Create todo
- `GET /api/progresses` - List progress records
- `POST /api/progresses` - Create progress record

## Permissions

### Public Role
- Read access to all content types (ExamCourse, Subject, Unit, Chapter, Module, Content)

### Authenticated Role
- Full CRUD access to student-related content types (Student, Enrollment, StudySession, Todo, Progress)
- Read access to all content types

## Email Configuration

The application uses Resend for email services:

1. **Signup Confirmation**: Sent when users register
2. **Password Reset**: Sent when users request password reset

### Resend Setup
1. Create a Resend account at [resend.com](https://resend.com)
2. Verify your domain or use a verified email address
3. Generate an API key
4. Configure the environment variables

## Database Schema

The application uses PostgreSQL with the following main tables:
- `exam_courses` - Exam course information
- `subjects` - Subject information with exam course relation
- `units` - Unit information with subject relation
- `chapters` - Chapter information with unit relation
- `modules` - Module information with chapter relation
- `contents` - Content information with module relation
- `students` - Student profiles
- `enrollments` - Student enrollments
- `study_sessions` - Study session tracking
- `todos` - Student todo items
- `progresses` - Progress tracking

## Development

### Project Structure
```
cms/
├── config/                 # Configuration files
├── src/
│   ├── api/               # API content types
│   ├── extensions/        # Plugin extensions
│   ├── admin/            # Admin panel customizations
│   └── index.js          # Application bootstrap
├── package.json
├── env.example           # Environment variables template
└── README.md
```

### Adding New Content Types
1. Create schema in `src/api/{content-type}/content-types/{content-type}/schema.json`
2. Create controller, service, and routes files
3. Update permissions in `src/bootstrap.js`

## Support

For issues and questions, please refer to the [Strapi documentation](https://docs.strapi.io/) or create an issue in the project repository.
