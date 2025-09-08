// File Path: /app/api/register/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// POST /api/register - Register a user for an event
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
//@ts-ignore
  if (!session || session.user.role !== 'USER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { eventId } = await request.json();
    //@ts-ignore
    const userId = session.user.id;

    if (!eventId) {
        return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
    }

    // Check if already registered
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { message: 'You are already registered for this event' },
        { status: 409 }
      );
    }

    const registration = await prisma.registration.create({
      data: {
        eventId,
        userId,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
