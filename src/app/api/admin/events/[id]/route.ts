import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Context = {
  params: { id: string };
};

// PUT = aktualizace akce
export async function PUT(request: Request, { params }: Context) {
  const id = Number(params.id);

  const { name, image, location, description, difficulty, amountCZK, variableSymbol, accountNumber, duration } = await request.json();

  if (
    !name ||
    !image ||
    !location ||
    !description ||
    !difficulty ||
    duration === undefined ||
    duration === null ||
    isNaN(Number(duration)) ||
    Number(duration) <= 0
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        name,
        image,
        location,
        description,
        difficulty,
        amountCZK: Number(amountCZK),
        variableSymbol,
        accountNumber,
        duration: String(duration),
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při aktualizaci." }, { status: 500 });
  }
}

// DELETE = mazání akce a návazných dat
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
    return NextResponse.json({ error: "Chyba při mazání akce." }, { status: 500 });
  }
}
