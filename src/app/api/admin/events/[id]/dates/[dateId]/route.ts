import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string; dateId: string } }) {
  const { date, capacity } = await request.json();

  if (!date || !capacity) {
    return NextResponse.json({ error: "Chybí data." }, { status: 400 });
  }

  try {
    const updated = await prisma.eventDate.update({
      where: { id: Number(params.dateId) },
      data: {
        date: new Date(date),
        capacity: Number(capacity),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při ukládání." }, { status: 500 });
  }
}