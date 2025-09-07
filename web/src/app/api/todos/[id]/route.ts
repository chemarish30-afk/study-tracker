import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const response = await strapi.updateTodo(parseInt(id), body.data);
    
    if ('error' in response) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await strapi.deleteTodo(parseInt(id));
    
    if ('error' in response) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
