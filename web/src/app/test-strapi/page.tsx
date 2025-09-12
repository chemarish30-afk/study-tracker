'use client';

import { useState } from 'react';

export default function TestStrapiPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testStrapi = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      // Test basic connectivity
      const response = await fetch('https://truthful-gift-3408f45803.strapiapp.com/api/exam-courses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setResult(`Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    setResult('Testing registration...');
    
    try {
      const response = await fetch('https://truthful-gift-3408f45803.strapiapp.com/api/auth/local/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser123',
          email: 'test123@example.com',
          password: 'testpassword123'
        }),
      });
      
      const data = await response.json();
      setResult(`Registration Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Registration Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Strapi API Test
          </h2>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={testStrapi}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Test Basic API Access
          </button>
          
          <button
            onClick={testRegistration}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            Test Registration Endpoint
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded">
            {result}
          </pre>
        </div>
      </div>
    </div>
  );
}
