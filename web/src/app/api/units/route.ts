import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const populate = searchParams.get('populate');
    const filters: Record<string, unknown> = {};
    
    // Parse filters from query parameters
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('filters[')) {
        const filterKey = key.replace('filters[', '').replace(']', '');
        filters[filterKey] = JSON.parse(value);
      }
    }
    
    const response = await strapi.getUnits({
      filters: Object.keys(filters).length > 0 ? filters : undefined,
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
    console.error('Error fetching units:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

