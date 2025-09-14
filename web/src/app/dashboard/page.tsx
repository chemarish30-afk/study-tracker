'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import Sidebar from '@/components/layout/Sidebar';
import TodoList from '@/components/dashboard/TodoList';
import ProgressBars from '@/components/dashboard/ProgressBars';
import StudyHours from '@/components/dashboard/StudyHours';
import ExamCountdown from '@/components/dashboard/ExamCountdown';

export default function DashboardPage() {
  const { user, studentId, allowedExamCourseIds, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin via AuthProvider
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
                <h1 className="text-2xl font-bold text-gray-900 ml-2 lg:ml-0">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 hidden sm:block">Welcome, {user.username}!</span>
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

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="w-full">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.username}!
              </h2>
              <p className="text-gray-600">
                Track your progress and stay on top of your study goals.
              </p>
            </div>

            {/* Dashboard Grid - Four Components */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Todo List */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <TodoList />
              </div>
              
              {/* Exam Countdown */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <ExamCountdown />
              </div>
              
              {/* Progress Bars */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <ProgressBars />
              </div>
              
              {/* Study Hours */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                <StudyHours />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
