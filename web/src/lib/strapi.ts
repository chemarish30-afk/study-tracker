import { cookies } from 'next/headers';

const STRAPI_URL = 'https://truthful-gift-3408f45803.strapiapp.com';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: unknown;
  };
}

export class StrapiClient {
  private baseUrl: string;
  private apiToken?: string;

  constructor() {
    if (!STRAPI_URL) {
      throw new Error('NEXT_PUBLIC_STRAPI_URL is not defined');
    }
    this.baseUrl = STRAPI_URL;
    this.apiToken = API_TOKEN;
  }

  private async getAuthToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;
    return token;
  }

  private async getHeaders(includeAuth = true): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`;
    } else if (includeAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth = true
  ): Promise<StrapiResponse<T> | StrapiError> {
    const url = `${this.baseUrl}/api${endpoint}`;
    const headers = await this.getHeaders(includeAuth);

    console.log('Making request to:', url);
    console.log('Request options:', { method: options.method, headers });

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('Non-JSON response:', text);
        data = { message: text };
      }

      if (!response.ok) {
        return {
          error: {
            status: response.status,
            name: 'StrapiError',
            message: data.message || 'An error occurred',
            details: data,
          },
        };
      }

      return data;
    } catch (error) {
      console.error('Request error:', error);
      return {
        error: {
          status: 500,
          name: 'NetworkError',
          message: error instanceof Error ? error.message : 'Network error',
        },
      };
    }
  }

  // Auth methods
  async register(userData: {
    username: string;
    email: string;
    password: string;
    email_confirmation_redirection?: string;
  }) {
    return this.request('/auth/local/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false);
  }

  async login(credentials: {
    identifier: string;
    password: string;
  }) {
    return this.request('/auth/local', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false);
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }, false);
  }

  async resetPassword(data: {
    code: string;
    password: string;
    passwordConfirmation: string;
  }) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }, false);
  }

  async getMe() {
    return this.request('/users/me');
  }

  // Content methods
  async getExamCourses(params?: {
    filters?: Record<string, unknown>;
    populate?: string;
    sort?: string;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        searchParams.append(`filters[${key}]`, JSON.stringify(value));
      });
    }
    
    if (params?.populate) {
      searchParams.append('populate', params.populate);
    }
    
    if (params?.sort) {
      searchParams.append('sort', params.sort);
    }

    const query = searchParams.toString();
    return this.request(`/exam-courses${query ? `?${query}` : ''}`);
  }

  async getSubjects(params?: {
    filters?: Record<string, unknown>;
    populate?: string;
    sort?: string;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        searchParams.append(`filters[${key}]`, JSON.stringify(value));
      });
    }
    
    if (params?.populate) {
      searchParams.append('populate', params.populate);
    }
    
    if (params?.sort) {
      searchParams.append('sort', params.sort);
    }

    const query = searchParams.toString();
    return this.request(`/subjects${query ? `?${query}` : ''}`);
  }

  async getUnits(params?: {
    filters?: Record<string, unknown>;
    populate?: string;
    sort?: string;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        searchParams.append(`filters[${key}]`, JSON.stringify(value));
      });
    }
    
    if (params?.populate) {
      searchParams.append('populate', params.populate);
    }
    
    if (params?.sort) {
      searchParams.append('sort', params.sort);
    }

    const query = searchParams.toString();
    return this.request(`/units${query ? `?${query}` : ''}`);
  }

  async getChapters(params?: {
    filters?: Record<string, unknown>;
    populate?: string;
    sort?: string;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        searchParams.append(`filters[${key}]`, JSON.stringify(value));
      });
    }
    
    if (params?.populate) {
      searchParams.append('populate', params.populate);
    }
    
    if (params?.sort) {
      searchParams.append('sort', params.sort);
    }

    const query = searchParams.toString();
    return this.request(`/chapters${query ? `?${query}` : ''}`);
  }

  async getModules(params?: {
    filters?: Record<string, unknown>;
    populate?: string;
    sort?: string;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        searchParams.append(`filters[${key}]`, JSON.stringify(value));
      });
    }
    
    if (params?.populate) {
      searchParams.append('populate', params.populate);
    }
    
    if (params?.sort) {
      searchParams.append('sort', params.sort);
    }

    const query = searchParams.toString();
    return this.request(`/modules${query ? `?${query}` : ''}`);
  }

  async getContents(params?: {
    filters?: Record<string, unknown>;
    populate?: string;
    sort?: string;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        searchParams.append(`filters[${key}]`, JSON.stringify(value));
      });
    }
    
    if (params?.populate) {
      searchParams.append('populate', params.populate);
    }
    
    if (params?.sort) {
      searchParams.append('sort', params.sort);
    }

    const query = searchParams.toString();
    return this.request(`/contents${query ? `?${query}` : ''}`);
  }

  // Student data methods
  async getStudents() {
    return this.request('/students?populate=*');
  }

  async createStudent(studentData: Record<string, unknown>) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify({ data: studentData }),
    });
  }

  async updateStudent(id: number, studentData: Record<string, unknown>) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: studentData }),
    });
  }

  async getEnrollments() {
    return this.request('/enrollments?populate=*');
  }

  async createEnrollment(enrollmentData: Record<string, unknown>) {
    return this.request('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ data: enrollmentData }),
    });
  }

  async getStudySessions() {
    return this.request('/study-sessions?populate=*');
  }

  async createStudySession(sessionData: Record<string, unknown>) {
    return this.request('/study-sessions', {
      method: 'POST',
      body: JSON.stringify({ data: sessionData }),
    });
  }

  async getTodos() {
    return this.request('/todos?populate=*');
  }

  async createTodo(todoData: Record<string, unknown>) {
    return this.request('/todos', {
      method: 'POST',
      body: JSON.stringify({ data: todoData }),
    });
  }

  async updateTodo(id: number, todoData: Record<string, unknown>) {
    return this.request(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: todoData }),
    });
  }

  async deleteTodo(id: number) {
    return this.request(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  async getProgresses() {
    return this.request('/progresses?populate=*');
  }

  async createProgress(progressData: Record<string, unknown>) {
    return this.request('/progresses', {
      method: 'POST',
      body: JSON.stringify({ data: progressData }),
    });
  }

  async updateProgress(id: number, progressData: Record<string, unknown>) {
    return this.request(`/progresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: progressData }),
    });
  }
}

export const strapi = new StrapiClient();
