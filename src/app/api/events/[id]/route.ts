import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Context = {
  params: { id: string };
};

// PUT – úprava akce
export async function PUT(request: Request, context: Context) {
  const { id: idParam } = context.params;
  const id = Number(idParam);
  const { name, location, description, difficulty, image, duration } = await request.json();

  if (!name || !location || !description || !difficulty || !image || typeof duration !== "string" || duration.trim() === "") {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { name, location, description, difficulty, image, duration },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("❌ Server error:", error);
    const message = error instanceof Error ? error.message : "Chyba při aktualizaci.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET – detail akce
export async function GET(_request: Request, context: Context) {
  const { id: idParam } = context.params;
  const id = Number(idParam);

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { eventDates: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("❌ Chyba při načítání:", error);
    const message = error instanceof Error ? error.message : "Chyba při načítání.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE – smaže akci + navázané entity
export async function DELETE(_request: Request, context: Context) {
  const { id: idParam } = context.params;
  const id = Number(idParam);

  try {
    await prisma.$transaction([
      prisma.registration.deleteMany({ where: { eventId: id } }),
      prisma.eventDate.deleteMany({ where: { eventId: id } }),
      prisma.event.delete({ where: { id } }),
    ]);

    return NextResponse.json({ message: "Akce a všechny návaznosti byly smazány." });
  } catch (error) {
    console.error("❌ Chyba při mazání:", error);
    const message = error instanceof Error ? error.message : "Chyba při mazání.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}