'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EmailConfirmationPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get URL parameters from window.location
        const urlParams = new URLSearchParams(window.location.search);
        const confirmation = urlParams.get('confirmation');
        const code = urlParams.get('code');

        console.log('Email confirmation params:', { confirmation, code });

        if (!confirmation || !code) {
          setStatus('error');
          setMessage('Invalid confirmation link. Please check your email and try again.');
          return;
        }

        const response = await fetch(`https://truthful-gift-3408f45803.strapiapp.com/api/auth/email-confirmation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ confirmation, code }),
        });

        const data = await response.json();
        console.log('Email confirmation response:', data);

        if (response.ok) {
          setStatus('success');
          setMessage('Email confirmed successfully! You can now sign in to your account.');
        } else {
          setStatus('error');
          setMessage(data.error?.message || data.message || 'Email confirmation failed. Please try again.');
        }
      } catch (error) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage('An error occurred during email confirmation. Please try again.');
      }
    };

    confirmEmail();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Confirmation
          </h2>
        </div>

        <div className="mt-8">
          {status === 'loading' && (
            <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                Confirming your email...
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {message}
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {message}
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/sign-in"
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
