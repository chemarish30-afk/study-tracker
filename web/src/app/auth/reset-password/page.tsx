'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ResetPasswordForm {
  code: string;
  password: string;
  passwordConfirmation: string;
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<ResetPasswordForm>({
    code: '',
    password: '',
    passwordConfirmation: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeFromUrl, setCodeFromUrl] = useState<string | null>(null);

  useEffect(() => {
    // Debug logging
    console.log('ResetPasswordPage mounted');
    console.log('Current URL:', window.location.href);
    console.log('Search params:', searchParams.toString());
    
    // Get code from URL parameters
    const code = searchParams.get('code');
    console.log('Code from URL:', code);
    
    if (code) {
      setCodeFromUrl(code);
      setFormData(prev => ({ ...prev, code }));
    }
  }, [searchParams]);

  const validateForm = (): string | null => {
    if (!formData.code.trim()) {
      return 'Reset code is required';
    }
    if (!formData.password.trim()) {
      return 'Password is required';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.passwordConfirmation) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        code: formData.code,
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation
      };

      console.log('Sending reset password request to Strapi:', requestBody);
      console.log('Strapi URL:', process.env.NEXT_PUBLIC_STRAPI_URL);

      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Reset password response:', data);
      console.log('Response status:', response.status);

      if (response.ok) {
        setSuccess(true);
        // Redirect to sign-in after 2 seconds
        setTimeout(() => {
          router.push('/auth/sign-in');
        }, 2000);
      } else {
        console.error('Reset password error details:', JSON.stringify(data, null, 2));
        setError(data.error?.message || data.message || 'Failed to reset password. The code may be invalid or expired.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Password Reset Successful
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your password has been successfully reset. You will be redirected to the sign-in page shortly.
            </p>
            <div className="mt-4">
              <Link
                href="/auth/sign-in"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {codeFromUrl 
              ? 'Enter your new password below.' 
              : 'Enter the reset code from your email and your new password.'
            }
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {!codeFromUrl && (
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Reset Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter reset code from email"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Paste the code from your password reset email
                </p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter new password"
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum 6 characters
              </p>
            </div>

            <div>
              <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                required
                value={formData.passwordConfirmation}
                onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Resetting Password...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/sign-in"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function ResetPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Loading...
          </h2>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
