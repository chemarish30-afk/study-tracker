'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Check if this is a reset password URL and redirect appropriately
    const currentPath = window.location.pathname;
    const searchParams = window.location.search;
    
    console.log('404 - Current path:', currentPath);
    console.log('404 - Search params:', searchParams);
    
    // Handle auth routes that might be misrouted
    if (currentPath.includes('/auth/')) {
      const newPath = currentPath.replace('/auth/', '/');
      console.log('Redirecting from', currentPath, 'to', newPath + searchParams);
      router.replace(newPath + searchParams);
      return;
    }
    
    // If it's a reset password URL, redirect to the correct path
    if (searchParams.includes('code=')) {
      console.log('Redirecting to reset-password with params');
      router.replace('/reset-password' + searchParams);
      return;
    }
    
    // Default redirect to home
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">Redirecting...</h2>
        <p className="text-gray-600">Please wait while we redirect you to the correct page.</p>
      </div>
    </div>
  );
}
