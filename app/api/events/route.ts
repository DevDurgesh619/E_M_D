// File Path: /app/api/events/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/events - Get all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        date: 'asc',
      },
    });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

// POST /api/events - Create a new event
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
//@ts-ignore
  if (!session || session.user.role !== 'ORGANIZER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description  ) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(),
        //@ts-ignore
        organizerId: session.user.id,
      },
    });

    // Bonus: Create notifications for all users
    const users = await prisma.user.findMany({ where: { role: 'USER' } });
    for (const user of users) {
        await prisma.notification.create({
            data: {
                message: `A new event has been posted: ${title}`,
                userId: user.id,
            }
        });
    }

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
