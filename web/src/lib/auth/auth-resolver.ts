interface User {
  id: number;
  username: string;
  email: string;
}

interface Student {
  id: number;
  targetExamDate?: string;
}

interface ExamCourse {
  id: number;
}

interface Enrollment {
  exam_course: ExamCourse;
}

interface AuthResolution {
  studentId: number | null;
  allowedExamCourseIds: number[];
  redirectTo: 'onboarding' | 'choose-exam' | 'dashboard';
}

export class AuthResolver {
  private static instance: AuthResolver;
  private cache: Map<number, AuthResolution> = new Map();
  private cacheExpiry: Map<number, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): AuthResolver {
    if (!AuthResolver.instance) {
      AuthResolver.instance = new AuthResolver();
    }
    return AuthResolver.instance;
  }

  private isCacheValid(userId: number): boolean {
    const expiry = this.cacheExpiry.get(userId);
    return expiry ? Date.now() < expiry : false;
  }

  private setCache(userId: number, resolution: AuthResolution): void {
    this.cache.set(userId, resolution);
    this.cacheExpiry.set(userId, Date.now() + this.CACHE_DURATION);
  }

  private getCache(userId: number): AuthResolution | null {
    if (this.isCacheValid(userId)) {
      return this.cache.get(userId) || null;
    }
    this.cache.delete(userId);
    this.cacheExpiry.delete(userId);
    return null;
  }

  async resolveUser(user: User): Promise<AuthResolution> {
    // Check cache first
    const cached = this.getCache(user.id);
    if (cached) {
      return cached;
    }

    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      throw new Error('No JWT token found');
    }

    try {
      // Step 1: Get Student by userId
      const studentResponse = await fetch(
        `https://truthful-gift-3408f45803.strapiapp.com/api/students?filters[user][id][$eq]=${user.id}&fields[0]=id&fields[1]=targetExamDate`,
        {
          headers: {
            'Authorization': `Bearer ${jwt}`,
          },
        }
      );

      if (!studentResponse.ok) {
        throw new Error(`Failed to fetch student: ${studentResponse.status}`);
      }

      const studentData = await studentResponse.json();
      const students = studentData.data || [];

      // If no Student → redirect to Onboarding
      if (students.length === 0) {
        const resolution: AuthResolution = {
          studentId: null,
          allowedExamCourseIds: [],
          redirectTo: 'onboarding'
        };
        this.setCache(user.id, resolution);
        return resolution;
      }

      const student: Student = students[0];

      // Step 2: Get Active Enrollments
      const enrollmentResponse = await fetch(
        `https://truthful-gift-3408f45803.strapiapp.com/api/enrollments?filters[student][user][id][$eq]=${user.id}&filters[status][$eq]=active&populate[exam_course][fields][0]=id`,
        {
          headers: {
            'Authorization': `Bearer ${jwt}`,
          },
        }
      );

      if (!enrollmentResponse.ok) {
        throw new Error(`Failed to fetch enrollments: ${enrollmentResponse.status}`);
      }

      const enrollmentData = await enrollmentResponse.json();
      const enrollments: Enrollment[] = enrollmentData.data || [];

      // Extract allowed exam course IDs
      const allowedExamCourseIds = enrollments.map(enrollment => enrollment.exam_course.id);

      // If Student exists but no active Enrollment → redirect to Choose Exam
      if (allowedExamCourseIds.length === 0) {
        const resolution: AuthResolution = {
          studentId: student.id,
          allowedExamCourseIds: [],
          redirectTo: 'choose-exam'
        };
        this.setCache(user.id, resolution);
        return resolution;
      }

      // Else → continue to Dashboard
      const resolution: AuthResolution = {
        studentId: student.id,
        allowedExamCourseIds,
        redirectTo: 'dashboard'
      };
      this.setCache(user.id, resolution);
      return resolution;

    } catch (error) {
      console.error('Auth resolution error:', error);
      // Fallback to onboarding on error
      const resolution: AuthResolution = {
        studentId: null,
        allowedExamCourseIds: [],
        redirectTo: 'onboarding'
      };
      return resolution;
    }
  }

  clearCache(userId?: number): void {
    if (userId) {
      this.cache.delete(userId);
      this.cacheExpiry.delete(userId);
    } else {
      this.cache.clear();
      this.cacheExpiry.clear();
    }
  }
}

export const authResolver = AuthResolver.getInstance();
