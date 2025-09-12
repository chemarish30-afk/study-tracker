'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ExamCourse } from '@/types';

export default function WelcomePage() {
  const router = useRouter();
  const [examCourses, setExamCourses] = useState<ExamCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<number | null>(null);

  useEffect(() => {
    fetchExamCourses();
  }, []);

  const fetchExamCourses = async () => {
    try {
      const response = await fetch('/api/exam-courses');
      if (response.ok) {
        const data = await response.json();
        setExamCourses(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching exam courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (examCourseId: number) => {
    setEnrolling(examCourseId);
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            exam_course: examCourseId,
            status: 'active',
          },
        }),
      });

      if (response.ok) {
        // Check if user has student profile
        const studentResponse = await fetch('/api/students');
        if (studentResponse.ok) {
          const studentData = await studentResponse.json();
          if (studentData.data && studentData.data.length > 0) {
            router.push('/dashboard');
          } else {
            router.push('/onboarding');
          }
        } else {
          router.push('/onboarding');
        }
      } else {
        alert('Failed to enroll. Please try again.');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading exam courses...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Study Tracker! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Choose an exam course to get started with your preparation journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examCourses.map((examCourse) => (
            <Card key={examCourse.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">
                  {examCourse.attributes.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {examCourse.attributes.summary && (
                  <p className="text-gray-600 mb-4">
                    {examCourse.attributes.summary}
                  </p>
                )}
                <button
                  onClick={() => handleEnroll(examCourse.id)}
                  disabled={enrolling === examCourse.id}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {enrolling === examCourse.id ? 'Joining...' : 'Join Course'}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {examCourses.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No exam courses available at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}



