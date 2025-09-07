// Strapi base types
export interface StrapiEntity {
  id: number;
  attributes: Record<string, unknown>;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Content types
export interface ExamCourse {
  id: number;
  attributes: {
    title: string;
    slug: string;
    summary?: string;
    order: number;
    subjects?: {
      data: Subject[];
    };
  };
}

export interface Subject {
  id: number;
  attributes: {
    title: string;
    slug: string;
    summary?: string;
    order: number;
    exam_course?: {
      data: ExamCourse;
    };
    units?: {
      data: Unit[];
    };
  };
}

export interface Unit {
  id: number;
  attributes: {
    title: string;
    slug: string;
    summary?: string;
    order: number;
    subject?: {
      data: Subject;
    };
    chapters?: {
      data: Chapter[];
    };
  };
}

export interface Chapter {
  id: number;
  attributes: {
    title: string;
    slug: string;
    summary?: string;
    order: number;
    unit?: {
      data: Unit;
    };
    modules?: {
      data: Module[];
    };
  };
}

export interface Module {
  id: number;
  attributes: {
    title: string;
    slug: string;
    summary?: string;
    order: number;
    chapter?: {
      data: Chapter;
    };
    contents?: {
      data: Content[];
    };
  };
}

export interface Content {
  id: number;
  attributes: {
    title: string;
    slug: string;
    order: number;
    body: string;
    module?: {
      data: Module;
    };
  };
}

// Student data types
export interface Student {
  id: number;
  attributes: {
    name: string;
    email: string;
    mobile?: string;
    dob?: string;
    state?: string;
    district?: string;
    exam: 'UPSC' | 'TNPSC' | 'NEET';
    targetYear?: number;
    otherInfo?: string;
    user?: {
      data: {
        id: number;
        attributes: {
          username: string;
          email: string;
        };
      };
    };
    enrollments?: {
      data: Enrollment[];
    };
    studySessions?: {
      data: StudySession[];
    };
    todos?: {
      data: Todo[];
    };
    progresses?: {
      data: Progress[];
    };
  };
}

export interface Enrollment {
  id: number;
  attributes: {
    enrolledAt: string;
    status: 'active' | 'completed' | 'paused' | 'cancelled';
    student?: {
      data: Student;
    };
    exam_course?: {
      data: ExamCourse;
    };
  };
}

export interface StudySession {
  id: number;
  attributes: {
    date: string;
    startAt: string;
    endAt: string;
    minutes: number;
    notes?: string;
    student?: {
      data: Student;
    };
  };
}

export interface Todo {
  id: number;
  attributes: {
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    student?: {
      data: Student;
    };
  };
}

export interface Progress {
  id: number;
  attributes: {
    percent: number;
    status: 'not_started' | 'in_progress' | 'done';
    lastAccessedAt?: string;
    completedAt?: string;
    student?: {
      data: Student;
    };
    content?: {
      data: Content;
    };
  };
}

// Auth types
export interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  role: {
    id: number;
    name: string;
    description: string;
    type: string;
  };
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface StrapiAuthResponse {
  data: AuthResponse;
}

// Form types
export interface SignUpForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInForm {
  identifier: string;
  password: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  code: string;
  password: string;
  passwordConfirmation: string;
}

export interface StudentForm {
  name: string;
  email: string;
  mobile?: string;
  dob?: string;
  state?: string;
  district?: string;
  exam: 'UPSC' | 'TNPSC' | 'NEET';
  targetYear?: number;
  otherInfo?: string;
}

export interface TodoForm {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed?: boolean;
}

export interface StudySessionForm {
  date: string;
  startAt: string;
  endAt: string;
  notes?: string;
}
