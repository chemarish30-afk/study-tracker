'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import Sidebar from '@/components/layout/Sidebar';

interface ExamCourse {
  id: number;
  title: string;
  slug: string;
  summary: string;
  order: number;
}

export default function ChooseExamPage() {
  const { user, studentId, logout, refreshAuth } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [examCourses, setExamCourses] = useState<ExamCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<number | null>(null);

  useEffect(() => {
    fetchExamCourses();
  }, []);

  const fetchExamCourses = async () => {
    try {
      const response = await fetch('https://truthful-gift-3408f45803.strapiapp.com/api/exam-courses');
      const data = await response.json();
      if (data.data) {
        setExamCourses(data.data);
      }
    } catch (error) {
      console.error('Error fetching exam courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (examCourseId: number) => {
    if (!studentId) return;

    setEnrolling(examCourseId);
    try {
      const jwt = localStorage.getItem('jwt');
      const response = await fetch('https://truthful-gift-3408f45803.strapiapp.com/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            student: studentId,
            exam_course: examCourseId,
            status: 'active',
          },
        }),
      });

      if (response.ok) {
        // Refresh auth to update enrollments
        await refreshAuth();
      } else {
        console.error('Failed to enroll in exam course');
      }
    } catch (error) {
      console.error('Error enrolling in exam course:', error);
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-900 ml-2 lg:ml-0">Choose Your Exam</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 hidden sm:block">Welcome, {user?.username}!</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Choose Exam Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-4xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Choose Your Exam Course
              </h2>
              <p className="text-gray-600">
                Select the exam you want to prepare for to access personalized learning content.
              </p>
            </div>

            {/* Exam Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {examCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm">{course.summary}</p>
                  </div>
                  
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolling === course.id}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling === course.id ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                </div>
              ))}
            </div>

            {examCourses.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Exam Courses Available</h3>
                <p className="text-gray-600">Please check back later for available exam courses.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
