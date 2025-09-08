import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
// Check if user is already registered
export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const session = await getServerSession(authOptions);
  //@ts-ignore
  if (!session || session.user.role !== "USER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try{
    const { eventId } = await params;

  const registration = await prisma.registration.findFirst({
    where: {
      eventId,
      //@ts-ignore
      userId: session.user.id,
    },
  });
  return NextResponse.json({ isRegistered: !!registration });
  }
  catch(e){
    console.error("This is ERROR: ",e)
  }

  
}

export async function DELETE(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const session = await getServerSession(authOptions);
  //@ts-ignore
  if (!session || session.user.role !== "USER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { eventId } = await params;

    // Check if registration exists
    const registration = await prisma.registration.findFirst({
      where: {
        eventId,
        //@ts-ignore
        userId: session.user.id,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { message: "Not registered for this event" },
        { status: 404 }
      );
    }

    // Delete the registration
    await prisma.registration.delete({
      where: { id: registration.id },
    });

    return NextResponse.json({ message: "Successfully unregistered" });
  } catch (e) {
    console.error("Error unregistering:", e);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
