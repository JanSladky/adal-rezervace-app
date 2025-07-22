import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const { date, capacity } = await request.json();

  if (!date || !capacity) {
    return NextResponse.json({ error: "Chybí datum nebo kapacita." }, { status: 400 });
  }

  try {
    const newDate = await prisma.eventDate.create({
      data: {
        eventId: Number(context.params.id),
        date: new Date(date),
        capacity: Number(capacity),
      },
    });

    return NextResponse.json(newDate);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při ukládání termínu." }, { status: 500 });
  }
}