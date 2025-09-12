import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Study Tracker 🌟 <span className="text-sm text-green-600">v2.0</span></h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/sign-in"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Your
            <span className="text-blue-600"> Competitive Exams</span>
          </h1>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-4">
            🚀 Latest Update: Enhanced Dashboard & Progress Tracking
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track your study progress, manage your learning journey, and achieve your goals with our comprehensive study tracking platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Start Your Journey
            </Link>
            <Link
              href="/sign-in"
              className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools for competitive exam preparation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Structured Learning
              </h3>
              <p className="text-gray-600">
                Organized content hierarchy from exam courses to individual modules for systematic learning.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-600">
                Monitor your study sessions, track completion rates, and visualize your progress.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Goal Management
              </h3>
              <p className="text-gray-600">
                Set targets, manage todos, and stay focused on your exam preparation goals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Types Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Exam Courses
            </h2>
            <p className="text-xl text-gray-600">
              Prepare for the most competitive exams in India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">UPSC</h3>
              <p className="text-gray-600 mb-4">
                Union Public Service Commission - Civil Services Examination
              </p>
              <div className="text-sm text-gray-500">
                Comprehensive preparation for IAS, IPS, IFS and other civil services
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">TNPSC</h3>
              <p className="text-gray-600 mb-4">
                Tamil Nadu Public Service Commission
              </p>
              <div className="text-sm text-gray-500">
                State-level civil services and other government positions
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">NEET</h3>
              <p className="text-gray-600 mb-4">
                National Eligibility cum Entrance Test
              </p>
              <div className="text-sm text-gray-500">
                Medical entrance examination for MBBS and BDS courses
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start your preparation?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who are already tracking their progress
          </p>
          <Link
            href="/sign-up"
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Study Tracker</h3>
            <p className="text-gray-400">
              Empowering students to achieve their competitive exam goals
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Deployed with ❤️ via GitHub Actions & Netlify
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}