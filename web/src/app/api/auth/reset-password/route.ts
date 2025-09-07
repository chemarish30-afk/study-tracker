import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';

export const dynamic = 'force-static';
import { ResetPasswordForm } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: ResetPasswordForm = await request.json();
    const { code, password, passwordConfirmation } = body;

    if (!code || !password || !passwordConfirmation) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== passwordConfirmation) {
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

    const response = await strapi.resetPassword({
      code,
      password,
      passwordConfirmation,
    });

    if ('error' in response) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status }
      );
    }

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

