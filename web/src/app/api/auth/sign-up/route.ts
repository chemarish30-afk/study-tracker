import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';
import { SignUpForm, StrapiAuthResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: SignUpForm = await request.json();
    const { username, email, password, confirmPassword } = body;

    console.log('Sign-up request body:', { username, email, password: '***', confirmPassword: '***' });

    if (!username || !email || !password || !confirmPassword) {
      console.log('Missing fields:', { username: !!username, email: !!email, password: !!password, confirmPassword: !!confirmPassword });
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if Strapi URL is configured
    if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
      console.error('NEXT_PUBLIC_STRAPI_URL is not configured');
      return NextResponse.json(
        { error: 'Backend service is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    console.log('Calling Strapi register...');
    
    // Add email confirmation redirection URL
    const registerData = {
      username,
      email,
      password,
      email_confirmation_redirection: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-netlify-site.netlify.app'}/auth/email-confirmation`
    };
    
    const response = await strapi.register(registerData);
    console.log('Strapi response:', response);

    if ('error' in response) {
      console.log('Strapi error:', response.error);
      
      // Provide more specific error messages
      let errorMessage = response.error.message;
      if (response.error.status === 400) {
        if (errorMessage.includes('email')) {
          errorMessage = 'This email is already registered. Please use a different email or try signing in.';
        } else if (errorMessage.includes('username')) {
          errorMessage = 'This username is already taken. Please choose a different username.';
        }
      } else if (response.error.status >= 500) {
        errorMessage = 'Backend service is temporarily unavailable. Please try again later.';
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.error.status }
      );
    }

    const { jwt, user } = (response as StrapiAuthResponse).data;

    // Set JWT as HttpOnly cookie
    const nextResponse = NextResponse.json(
      { user },
      { status: 201 }
    );

    nextResponse.cookies.set('jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return nextResponse;
  } catch (error) {
    console.error('Sign-up error:', error);
    
    // Check if it's a network error
    if (error instanceof Error && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Unable to connect to the server. Please check your internet connection and try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
