import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { eventId, eventDateId, name, email, attendees } = await request.json();

  if (!eventId || !eventDateId || !name || !email || !attendees) {
    return NextResponse.json({ error: "Chybí požadovaná pole." }, { status: 400 });
  }

  try {
    await prisma.registration.create({
      data: {
        eventId: Number(eventId),
        eventDateId: Number(eventDateId),
        name,
        email,
        attendees: Number(attendees),
      },
    });

    return NextResponse.json({ message: "Registrace úspěšná." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při registraci." }, { status: 500 });
  }
}