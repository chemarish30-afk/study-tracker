'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import StudentOnboardingForm from '@/components/onboarding/StudentOnboardingForm';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Subject {
  id: number;
  title: string;
  slug: string;
  summary: string;
  order: number;
  exam_course: {
    title: string;
  };
  units: Unit[];
}

interface Unit {
  id: number;
  title: string;
  slug: string;
  summary: string;
  order: number;
  chapters: Chapter[];
}

interface Chapter {
  id: number;
  title: string;
  slug: string;
  summary: string;
  order: number;
  modules: Module[];
}

interface Module {
  id: number;
  title: string;
  slug: string;
  summary: string;
  order: number;
  contents: Content[];
}

interface Content {
  id: number;
  title: string;
  slug: string;
  order: number;
  body: string;
}

export default function LearningPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [, setHasStudentProfile] = useState<boolean | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const jwt = localStorage.getItem('jwt');
    const userData = localStorage.getItem('user');

    if (!jwt || !userData) {
      router.push('/signin');
      return;
    }

    const checkStudentProfile = async () => {
      try {
        const response = await fetch('https://truthful-gift-3408f45803.strapiapp.com/api/students?filters[user][id][$eq]=' + user?.id, {
          headers: {
            'Authorization': `Bearer ${jwt}`,
          },
        });
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          setHasStudentProfile(true);
          fetchSubjects();
        } else {
          setHasStudentProfile(false);
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking student profile:', error);
        setHasStudentProfile(false);
        setShowOnboarding(true);
      }
    };

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      checkStudentProfile();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/signin');
    } finally {
      setLoading(false);
    }
  }, [router]);


  const handleOnboardingSubmit = async (formData: {
    name: string;
    email: string;
    mobile: string;
    dob: string;
    state: string;
    district: string;
    exam: 'UPSC' | 'TNPSC' | 'NEET';
    targetYear: number;
    otherInfo: string;
  }) => {
    try {
      const jwt = localStorage.getItem('jwt');
      const response = await fetch('https://truthful-gift-3408f45803.strapiapp.com/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            ...formData,
            user: user?.id,
          },
        }),
      });

      if (response.ok) {
        setHasStudentProfile(true);
        setShowOnboarding(false);
        fetchSubjects();
      } else {
        throw new Error('Failed to create student profile');
      }
    } catch (error) {
      console.error('Error creating student profile:', error);
      throw error;
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch('https://truthful-gift-3408f45803.strapiapp.com/api/subjects?populate=*');
      const data = await response.json();
      if (data.data) {
        setSubjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      // Use mock data for now
      setSubjects([
        {
          id: 1,
          title: 'Modern Indian History',
          slug: 'modern-indian-history',
          summary: 'Comprehensive study of modern Indian history',
          order: 1,
          exam_course: { title: 'UPSC' },
          units: [
            {
              id: 1,
              title: 'Freedom Struggle',
              slug: 'freedom-struggle',
              summary: 'Indian independence movement',
              order: 1,
              chapters: [
                {
                  id: 1,
                  title: 'Early Nationalism',
                  slug: 'early-nationalism',
                  summary: 'Formation of early nationalist movements',
                  order: 1,
                  modules: [
                    {
                      id: 1,
                      title: 'Indian National Congress',
                      slug: 'indian-national-congress',
                      summary: 'Formation and early years of INC',
                      order: 1,
                      contents: [
                        { id: 1, title: 'Foundation of INC', slug: 'foundation-inc', order: 1, body: 'Content about INC foundation' },
                        { id: 2, title: 'Early Leaders', slug: 'early-leaders', order: 2, body: 'Content about early leaders' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 2,
          title: 'Indian Polity',
          slug: 'indian-polity',
          summary: 'Constitutional framework and governance',
          order: 2,
          exam_course: { title: 'UPSC' },
          units: [
            {
              id: 2,
              title: 'Constitution',
              slug: 'constitution',
              summary: 'Indian Constitution study',
              order: 1,
              chapters: [
                {
                  id: 2,
                  title: 'Fundamental Rights',
                  slug: 'fundamental-rights',
                  summary: 'Constitutional rights and duties',
                  order: 1,
                  modules: [
                    {
                      id: 2,
                      title: 'Right to Equality',
                      slug: 'right-equality',
                      summary: 'Article 14-18 of Constitution',
                      order: 1,
                      contents: [
                        { id: 3, title: 'Article 14', slug: 'article-14', order: 1, body: 'Content about Article 14' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    router.push('/signin');
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderContent = (content: Content) => (
    <div key={content.id} className="ml-8 p-2 bg-blue-50 rounded border-l-4 border-blue-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-blue-900">{content.title}</span>
        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
          Start
        </button>
      </div>
    </div>
  );

  const renderModule = (module: Module) => (
    <div key={module.id} className="ml-6">
      <div 
        className="flex items-center justify-between p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
        onClick={() => toggleExpanded(`module-${module.id}`)}
      >
        <span className="text-sm font-medium text-gray-800">{module.title}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${expandedItems.has(`module-${module.id}`) ? 'rotate-90' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      {expandedItems.has(`module-${module.id}`) && (
        <div className="mt-2 space-y-1">
          {module.contents.map(renderContent)}
        </div>
      )}
    </div>
  );

  const renderChapter = (chapter: Chapter) => (
    <div key={chapter.id} className="ml-4">
      <div 
        className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
        onClick={() => toggleExpanded(`chapter-${chapter.id}`)}
      >
        <span className="text-sm font-medium text-gray-700">{chapter.title}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${expandedItems.has(`chapter-${chapter.id}`) ? 'rotate-90' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      {expandedItems.has(`chapter-${chapter.id}`) && (
        <div className="mt-2 space-y-1">
          {chapter.modules.map(renderModule)}
        </div>
      )}
    </div>
  );

  const renderUnit = (unit: Unit) => (
    <div key={unit.id} className="ml-2">
      <div 
        className="flex items-center justify-between p-2 bg-white rounded border cursor-pointer hover:bg-gray-50"
        onClick={() => toggleExpanded(`unit-${unit.id}`)}
      >
        <span className="text-sm font-medium text-gray-900">{unit.title}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${expandedItems.has(`unit-${unit.id}`) ? 'rotate-90' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      {expandedItems.has(`unit-${unit.id}`) && (
        <div className="mt-2 space-y-1">
          {unit.chapters.map(renderChapter)}
        </div>
      )}
    </div>
  );

  const renderSubject = (subject: Subject) => (
    <div key={subject.id} className="mb-4">
      <div 
        className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
        onClick={() => toggleExpanded(`subject-${subject.id}`)}
      >
        <div>
          <h3 className="font-semibold">{subject.title}</h3>
          <p className="text-sm text-blue-100">{subject.summary}</p>
        </div>
        <svg 
          className={`w-5 h-5 transition-transform ${expandedItems.has(`subject-${subject.id}`) ? 'rotate-90' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      {expandedItems.has(`subject-${subject.id}`) && (
        <div className="mt-2 space-y-1">
          {subject.units.map(renderUnit)}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
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
                <h1 className="text-2xl font-bold text-gray-900 ml-2 lg:ml-0">Start Learning</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 hidden sm:block">Welcome, {user.username}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Learning Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="w-full">
            {showOnboarding ? (
              /* Onboarding Form */
              <StudentOnboardingForm 
                user={user} 
                onSubmit={handleOnboardingSubmit}
              />
            ) : (
              /* Learning Content */
              <>
                {/* Welcome Section */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Choose Your Learning Path
                  </h2>
                  <p className="text-gray-600">
                    Explore subjects and start your learning journey.
                  </p>
                </div>

                {/* Subjects Hierarchy */}
                <div className="space-y-4">
                  {subjects.map(renderSubject)}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
