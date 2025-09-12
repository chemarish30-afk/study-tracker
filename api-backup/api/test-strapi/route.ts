import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    console.log('Testing Strapi connection to:', strapiUrl);
    
    // Test basic connectivity
    const response = await fetch(`${strapiUrl}/api/exam-courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Strapi response status:', response.status);
    console.log('Strapi response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ 
        success: true, 
        message: 'Strapi connection successful',
        data: data 
      });
    } else {
      const text = await response.text();
      return NextResponse.json({ 
        success: false, 
        message: 'Strapi connection failed',
        status: response.status,
        response: text 
      });
    }
  } catch (error) {
    console.error('Strapi test error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Strapi connection error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

