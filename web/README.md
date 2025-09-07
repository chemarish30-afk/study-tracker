# Study Tracker - Next.js Frontend

A modern Next.js 14 frontend application for the Study Tracker platform, built with TypeScript, TailwindCSS, and App Router.

## Features

- **Authentication**: Complete auth flow with sign-up, sign-in, forgot password, and reset password
- **Dashboard**: Personalized dashboard with study tracking, progress monitoring, and todo management
- **Course Navigation**: Hierarchical content browsing from exam courses to individual content
- **Student Management**: Profile management and onboarding flow
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Real-time Updates**: ISR (Incremental Static Regeneration) for content updates

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: JWT with HttpOnly cookies
- **State Management**: React hooks and server state
- **API Integration**: Strapi v4 backend

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- Strapi backend running (see `/cms` directory)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update the `.env.local` file with your configuration:
   ```env
   # Strapi Configuration
   NEXT_PUBLIC_STRAPI_URL=https://your-strapi-instance.com
   STRAPI_API_TOKEN=your_optional_read_token
   REVALIDATE_SECRET=your_revalidate_secret
   
   # Email Configuration (same as CMS)
   RESEND_API_KEY=your_resend_api_key
   RESEND_FROM_EMAIL=your_verified_email@domain.com
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Project Structure

```
web/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── api/               # API route handlers
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard page
│   │   ├── courses/           # Courses section
│   │   ├── profile/           # Profile management
│   │   └── onboarding/        # Student onboarding
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utility functions
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
└── README.md
```

## Key Features

### Authentication Flow

- **Sign Up**: User registration with email verification
- **Sign In**: JWT-based authentication
- **Password Reset**: Email-based password reset flow
- **Protected Routes**: Middleware-based route protection

### Dashboard

- **Personalized Greeting**: Dynamic greeting based on exam type (IAS suffix for UPSC/TNPSC, Dr. prefix for NEET)
- **Study Tracking**: Weekly study time calculation
- **Progress Monitoring**: Overall progress visualization
- **Exam Countdown**: Animated countdown to target exam date
- **Todo Management**: Full CRUD operations for tasks

### Course Navigation

- **Hierarchical Structure**: Exam → Subject → Unit → Chapter → Module → Content
- **Breadcrumb Navigation**: Clear navigation path
- **Content Display**: Rich text content rendering
- **ISR Support**: Incremental static regeneration for performance

### Student Management

- **Profile Creation**: Comprehensive onboarding form
- **Profile Updates**: Editable student information
- **Exam Preferences**: Target exam and year selection

## API Integration

The frontend communicates with the Strapi backend through:

- **Authentication**: `/api/auth/*` routes for user management
- **Content**: `/api/exam-courses`, `/api/subjects`, etc. for content hierarchy
- **Student Data**: `/api/students`, `/api/enrollments`, etc. for user data
- **Study Tracking**: `/api/study-sessions`, `/api/todos`, `/api/progresses`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_STRAPI_URL` | Strapi backend URL | Yes |
| `STRAPI_API_TOKEN` | Optional read token for public content | No |
| `REVALIDATE_SECRET` | Secret for webhook revalidation | Yes |
| `RESEND_API_KEY` | Resend API key for emails | Yes |
| `RESEND_FROM_EMAIL` | Verified sender email | Yes |

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- TailwindCSS for styling
- ESLint for code quality
- Prettier for code formatting (recommended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions, please refer to the main project documentation or create an issue in the repository.