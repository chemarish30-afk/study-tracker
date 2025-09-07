import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';

export const dynamic = 'force-static';
import { ForgotPasswordForm } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: ForgotPasswordForm = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const response = await strapi.forgotPassword(email);

    if ('error' in response) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status }
      );
    }

    return NextResponse.json(
      { message: 'Password reset email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

