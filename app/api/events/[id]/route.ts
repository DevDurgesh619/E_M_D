// File Path: /app/api/events/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route'
import prisma from '@/lib/prisma';

// GET /api/events/:id - Get a single event with registration count
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = (await params).id;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
//@ts-ignore
  if (!session || session.user?.role !== 'ORGANIZER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } =  await params;

  try {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ msg: "Event deleted" }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
