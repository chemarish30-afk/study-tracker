import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';
import { SignInForm, StrapiAuthResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: SignInForm = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Identifier and password are required' },
        { status: 400 }
      );
    }

    const response = await strapi.login({ identifier, password });

    if ('error' in response) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status }
      );
    }

    const { jwt, user } = (response as StrapiAuthResponse).data;

    // Set JWT as HttpOnly cookie
    const nextResponse = NextResponse.json(
      { user },
      { status: 200 }
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
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
