import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  const { name, date, capacity, image, location, description, difficulty } = await request.json();

  if (!name || !date || !capacity || !image || !location || !description || !difficulty) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        name,
        date: new Date(date),
        capacity: Number(capacity),
        image,
        location,
        description,
        difficulty,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při aktualizaci." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  try {
    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ message: "Akce byla smazána." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při mazání." }, { status: 500 });
  }
}