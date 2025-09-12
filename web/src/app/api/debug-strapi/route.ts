import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    console.log('Testing Strapi connection to:', strapiUrl);
    
    // Test basic connectivity
    const response = await fetch(`${strapiUrl}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword123'
      }),
    });

    console.log('Strapi response status:', response.status);
    console.log('Strapi response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Strapi response body:', responseText);

    return NextResponse.json({ 
      success: true, 
      message: 'Strapi connection test completed',
      strapiUrl,
      status: response.status,
      response: responseText
    });
  } catch (error) {
    console.error('Strapi test error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Strapi connection error',
      error: error instanceof Error ? error.message : 'Unknown error',
      strapiUrl: process.env.NEXT_PUBLIC_STRAPI_URL
    });
  }
}
