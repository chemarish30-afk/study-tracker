import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';

export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const populate = searchParams.get('populate');
    
    const response = await strapi.getExamCourses({
      populate: populate || undefined,
      sort: 'order:asc',
    });
    
    if ('error' in response) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching exam courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

