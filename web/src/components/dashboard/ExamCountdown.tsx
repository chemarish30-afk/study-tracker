'use client';

import { useState, useEffect } from 'react';

interface Exam {
  id: number;
  name: string;
  date: string;
  type: 'prelims' | 'mains' | 'interview';
}

export default function ExamCountdown() {
  const [exams] = useState<Exam[]>([
    {
      id: 1,
      name: 'UPSC Prelims 2024',
      date: '2024-06-16',
      type: 'prelims',
    },
    {
      id: 2,
      name: 'UPSC Mains 2024',
      date: '2024-09-20',
      type: 'mains',
    },
    {
      id: 3,
      name: 'UPSC Interview 2024',
      date: '2025-01-15',
      type: 'interview',
    },
  ]);

  const [timeLeft, setTimeLeft] = useState<{ [key: number]: { days: number; hours: number; minutes: number; seconds: number } }>({});

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const newTimeLeft: { [key: number]: { days: number; hours: number; minutes: number; seconds: number } } = {};

      exams.forEach(exam => {
        const examDate = new Date(exam.date).getTime();
        const difference = examDate - now;

        if (difference > 0) {
          newTimeLeft[exam.id] = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000),
          };
        } else {
          newTimeLeft[exam.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });

      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [exams]);

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'prelims': return 'bg-red-100 text-red-800 border-red-200';
      case 'mains': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interview': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getExamTypeIcon = (type: string) => {
    switch (type) {
      case 'prelims': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
      case 'mains': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
      case 'interview': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
      default: return null;
    }
  };

  const getNextExam = () => {
    const now = new Date().getTime();
    const upcomingExams = exams.filter(exam => new Date(exam.date).getTime() > now);
    return upcomingExams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  };

  const nextExam = getNextExam();

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Exam Countdown</h3>
        <div className="text-right">
          <div className="text-sm text-gray-500">Next Exam</div>
          <div className="text-lg font-semibold text-gray-900">
            {nextExam ? nextExam.name : 'No upcoming exams'}
          </div>
        </div>
      </div>

      {nextExam && timeLeft[nextExam.id] && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="mr-2">{getExamTypeIcon(nextExam.type)}</span>
              <h4 className="text-lg font-medium text-gray-900">{nextExam.name}</h4>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getExamTypeColor(nextExam.type)}`}>
              {nextExam.type.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{timeLeft[nextExam.id].days}</div>
              <div className="text-xs text-gray-500">Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{timeLeft[nextExam.id].hours}</div>
              <div className="text-xs text-gray-500">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{timeLeft[nextExam.id].minutes}</div>
              <div className="text-xs text-gray-500">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{timeLeft[nextExam.id].seconds}</div>
              <div className="text-xs text-gray-500">Seconds</div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600">
              Exam Date: {new Date(nextExam.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      )}

      {/* All exams list */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">All Exams</h4>
        {exams.map((exam) => (
          <div key={exam.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <span className="mr-3">{getExamTypeIcon(exam.type)}</span>
              <div>
                <div className="text-sm font-medium text-gray-900">{exam.name}</div>
                <div className="text-xs text-gray-500">
                  {new Date(exam.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getExamTypeColor(exam.type)}`}>
                {exam.type}
              </span>
              {timeLeft[exam.id] && (
                <div className="text-xs text-gray-500 mt-1">
                  {timeLeft[exam.id].days > 0 ? `${timeLeft[exam.id].days}d left` : 'Completed'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      {nextExam && timeLeft[nextExam.id] && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Preparation Progress</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
