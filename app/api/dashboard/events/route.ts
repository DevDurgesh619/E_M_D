// File Path: /app/api/dashboard/events/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/dashboard/events - Get events for the logged-in organizer
export async function GET() {
  const session = await getServerSession(authOptions);
//@ts-ignore
  if (!session || session.user.role !== 'ORGANIZER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        //@ts-ignore
        organizerId: session.user.id,
      },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard events:", error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

