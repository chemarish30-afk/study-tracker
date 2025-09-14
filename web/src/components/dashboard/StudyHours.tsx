'use client';

import { useState } from 'react';

interface StudySession {
  date: string;
  hours: number;
  subject: string;
}

export default function StudyHours() {
  const [studySessions] = useState<StudySession[]>([
    { date: '2024-01-15', hours: 3.5, subject: 'History' },
    { date: '2024-01-14', hours: 2.0, subject: 'Polity' },
    { date: '2024-01-13', hours: 4.0, subject: 'Geography' },
    { date: '2024-01-12', hours: 1.5, subject: 'Science' },
    { date: '2024-01-11', hours: 3.0, subject: 'Current Affairs' },
    { date: '2024-01-10', hours: 2.5, subject: 'History' },
    { date: '2024-01-09', hours: 0, subject: 'Rest Day' },
  ]);

  const [newSession, setNewSession] = useState({
    hours: '',
    subject: '',
  });

  const addSession = () => {
    if (newSession.hours && newSession.subject) {
      const today = new Date().toISOString().split('T')[0];
      const session: StudySession = {
        date: today,
        hours: parseFloat(newSession.hours),
        subject: newSession.subject,
      };
      // In a real app, this would be saved to the backend
      console.log('New session:', session);
      setNewSession({ hours: '', subject: '' });
    }
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getTotalHours = () => {
    return studySessions.reduce((sum, session) => sum + session.hours, 0);
  };

  const getAverageHours = () => {
    const studyDays = studySessions.filter(session => session.hours > 0);
    return studyDays.length > 0 ? (getTotalHours() / studyDays.length).toFixed(1) : '0';
  };

  const getMaxHours = () => {
    return Math.max(...studySessions.map(session => session.hours));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Study Hours</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{getTotalHours()}h</div>
          <div className="text-sm text-gray-500">This Week</div>
        </div>
      </div>

      {/* Add new session */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Log Today&apos;s Study</h4>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.5"
            min="0"
            max="12"
            value={newSession.hours}
            onChange={(e) => setNewSession({ ...newSession, hours: e.target.value })}
            placeholder="Hours"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            value={newSession.subject}
            onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
            placeholder="Subject"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addSession}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">This Week</h4>
        <div className="flex items-end justify-between h-32 gap-2">
          {studySessions.map((session, index) => {
            const height = session.hours > 0 ? (session.hours / getMaxHours()) * 100 : 5;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full flex flex-col items-center">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      session.hours > 0 ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2">
                    {session.hours > 0 ? `${session.hours}h` : '0h'}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {getDayName(session.date)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent sessions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900">Recent Sessions</h4>
        {studySessions.slice(0, 5).map((session, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                session.hours > 0 ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(session.date).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">{session.subject}</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {session.hours > 0 ? `${session.hours}h` : 'Rest'}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{getAverageHours()}h</div>
          <div className="text-xs text-gray-500">Daily Average</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {studySessions.filter(session => session.hours > 0).length}
          </div>
          <div className="text-xs text-gray-500">Study Days</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {studySessions.filter(session => session.hours === 0).length}
          </div>
          <div className="text-xs text-gray-500">Rest Days</div>
        </div>
      </div>
    </div>
  );
}
