import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Context = {
  params: { id: string };
};

export async function PUT(request: Request, { params }: Context) {
  const id = Number(params.id);
  const { name, location, description, difficulty, image } = await request.json();

  if (!name || !location || !description || !difficulty || !image) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        name,
        location,
        description,
        difficulty,
        image,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při aktualizaci." }, { status: 500 });
  }
}
export async function GET(_request: Request, { params }: Context) {
  const id = Number(params.id);

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        eventDates: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při načítání." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const id = Number(params.id);

  try {
    await prisma.$transaction([
      prisma.registration.deleteMany({ where: { eventId: id } }),
      prisma.eventDate.deleteMany({ where: { eventId: id } }),
      prisma.event.delete({ where: { id } }),
    ]);

    return NextResponse.json({ message: "Akce a všechny návaznosti byly smazány." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při mazání." }, { status: 500 });
  }
}
