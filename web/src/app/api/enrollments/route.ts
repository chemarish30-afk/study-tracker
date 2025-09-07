import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';

export async function GET() {
  try {
    const response = await strapi.getEnrollments();
    
    if ('error' in response) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await strapi.createEnrollment(body.data);
    
    if ('error' in response) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

