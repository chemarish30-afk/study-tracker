import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { confirmation, code } = body;

    if (!confirmation || !code) {
      return NextResponse.json(
        { error: 'Confirmation and code are required' },
        { status: 400 }
      );
    }

    console.log('Email confirmation request:', { confirmation, code });

    const response = await strapi.request('/auth/email-confirmation', {
      method: 'POST',
      body: JSON.stringify({ confirmation, code }),
    }, false);

    console.log('Strapi email confirmation response:', response);

    if ('error' in response) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status }
      );
    }

    return NextResponse.json(
      { message: 'Email confirmed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email confirmation error:', error);
    return NextResponse.json(
      { error: 'An error occurred during email confirmation' },
      { status: 500 }
    );
  }
}
