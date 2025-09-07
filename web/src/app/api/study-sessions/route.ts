import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const response = await strapi.getStudySessions();
    
    if ('error' in response) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching study sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await strapi.createStudySession(body.data);
    
    if ('error' in response) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating study session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

