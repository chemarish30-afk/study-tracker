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

    console.log('Calling Strapi register...');
    const response = await strapi.register({ username, email, password });
    console.log('Strapi response:', response);

    if ('error' in response) {
      console.log('Strapi error:', response.error);
      return NextResponse.json(
        { error: response.error.message },
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
