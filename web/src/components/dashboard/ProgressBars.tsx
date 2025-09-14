'use client';

interface Module {
  id: number;
  name: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

export default function ProgressBars() {
  const modules: Module[] = [
    {
      id: 1,
      name: 'Modern Indian History',
      progress: 75,
      totalLessons: 20,
      completedLessons: 15,
    },
    {
      id: 2,
      name: 'Indian Polity',
      progress: 45,
      totalLessons: 15,
      completedLessons: 7,
    },
    {
      id: 3,
      name: 'Geography of India',
      progress: 90,
      totalLessons: 10,
      completedLessons: 9,
    },
    {
      id: 4,
      name: 'General Science',
      progress: 30,
      totalLessons: 25,
      completedLessons: 8,
    },
    {
      id: 5,
      name: 'Current Affairs',
      progress: 60,
      totalLessons: 12,
      completedLessons: 7,
    },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallProgress = Math.round(
    modules.reduce((sum, module) => sum + module.progress, 0) / modules.length
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 rounded-t-none">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Module Progress</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{overallProgress}%</div>
          <div className="text-sm text-gray-500">Overall Progress</div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Completion</span>
          <span>{overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(overallProgress)}`}
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Individual module progress */}
      <div className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-900">{module.name}</h4>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getProgressTextColor(module.progress)}`}>
                  {module.progress}%
                </span>
                <span className="text-xs text-gray-500">
                  {module.completedLessons}/{module.totalLessons}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(module.progress)}`}
                style={{ width: `${module.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {modules.reduce((sum, module) => sum + module.completedLessons, 0)}
          </div>
          <div className="text-xs text-gray-500">Lessons Completed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {modules.reduce((sum, module) => sum + module.totalLessons, 0)}
          </div>
          <div className="text-xs text-gray-500">Total Lessons</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {modules.filter(module => module.progress === 100).length}
          </div>
          <div className="text-xs text-gray-500">Modules Completed</div>
        </div>
      </div>
    </div>
  );
}
