'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Countdown } from '@/components/ui/Countdown';
import { ToDoGrid } from '@/components/ui/ToDoGrid';
import { Student, StudySession, Todo, Progress, TodoForm } from '@/types';

export default function DashboardPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [progresses, setProgresses] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentRes, sessionsRes, todosRes, progressRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/study-sessions'),
        fetch('/api/todos'),
        fetch('/api/progresses'),
      ]);

      if (studentRes.ok) {
        const studentData = await studentRes.json();
        setStudent(studentData.data?.[0] || null);
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setStudySessions(sessionsData.data || []);
      }

      if (todosRes.ok) {
        const todosData = await todosRes.json();
        setTodos(todosData.data || []);
      }

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgresses(progressData.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (todoData: TodoForm) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            ...todoData,
            completed: false,
          },
        }),
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleUpdateTodo = async (id: number, todoData: Partial<TodoForm>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: todoData,
        }),
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const getGreeting = () => {
    if (!student) return 'Welcome!';
    
    const name = student.attributes.name.split(' ')[0];
    const exam = student.attributes.exam;
    
    if (exam === 'UPSC' || exam === 'TNPSC') {
      return `${name} IAS`;
    } else if (exam === 'NEET') {
      return `Dr. ${name}`;
    }
    
    return name;
  };

  const getTargetDate = () => {
    if (!student?.attributes.targetYear) return new Date();
    return new Date(`${student.attributes.targetYear}-01-01`);
  };

  const getWeeklyStudyTime = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return studySessions
      .filter(session => new Date(session.attributes.date) >= oneWeekAgo)
      .reduce((total, session) => total + session.attributes.minutes, 0);
  };

  const getOverallProgress = () => {
    if (progresses.length === 0) return 0;
    
    const totalProgress = progresses.reduce((sum, progress) => sum + progress.attributes.percent, 0);
    return totalProgress / progresses.length;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {getGreeting()}! 👋
          </h1>
          <p className="text-blue-100">
            Ready to continue your {student?.attributes.exam} preparation journey?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">📚</span>
                Weekly Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {Math.floor(getWeeklyStudyTime() / 60)}h {getWeeklyStudyTime() % 60}m
              </div>
              <p className="text-sm text-gray-600 mt-1">
                This week&apos;s total study time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">📊</span>
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {Math.round(getOverallProgress())}%
              </div>
              <ProgressBar 
                value={getOverallProgress()} 
                className="mt-2"
                showLabel={false}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">✅</span>
                Completed Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {todos.filter(todo => todo.attributes.completed).length}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                out of {todos.length} total tasks
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Exam Countdown */}
        {student?.attributes.targetYear && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">⏰</span>
                {student.attributes.exam} {student.attributes.targetYear} Countdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Countdown targetDate={getTargetDate()} />
            </CardContent>
          </Card>
        )}

        {/* To-Do List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ToDoGrid
              todos={todos}
              onAddTodo={handleAddTodo}
              onUpdateTodo={handleUpdateTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          </CardContent>
        </Card>

        {/* Recent Study Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">📖</span>
              Recent Study Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studySessions.length > 0 ? (
              <div className="space-y-3">
                {studySessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(session.attributes.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.attributes.startAt} - {session.attributes.endAt}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-600">
                        {session.attributes.minutes} min
                      </p>
                      {session.attributes.notes && (
                        <p className="text-sm text-gray-500 truncate max-w-32">
                          {session.attributes.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No study sessions recorded yet. Start studying to see your progress here!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

