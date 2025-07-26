import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache"; // ZMĚNA ZDE: Přidán import

type Context = {
  params: { id: string };
};

// GET – detail akce
export async function GET(_request: Request, context: Context) {
  const id = Number(context.params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Neplatné ID akce." }, { status: 400 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { eventDates: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Akce nebyla nalezena." }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("❌ Chyba při načítání akce:", error);
    return NextResponse.json({ error: "Chyba serveru při načítání akce." }, { status: 500 });
  }
}

// PUT – úprava akce
export async function PUT(request: Request, context: Context) {
  const id = Number(context.params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Neplatné ID akce." }, { status: 400 });
  }

  const body = await request.json();
  const { name, location, description, difficulty, image, duration, variableSymbol, accountNumber } = body;

  if (
    !name ||
    !location ||
    !description ||
    !difficulty ||
    !image ||
    typeof duration !== "string" ||
    duration.trim() === "" ||
    !variableSymbol ||
    !accountNumber
  ) {
    return NextResponse.json({ error: "Chybí nebo jsou neplatná pole." }, { status: 400 });
  }

  try {
    const updated = await prisma.event.update({
      where: { id },
      data: { name, location, description, difficulty, image, duration, variableSymbol, accountNumber },
    });

    revalidatePath("/"); // ZMĚNA ZDE: Přidána revalidace po úpravě

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ Chyba při aktualizaci akce:", error);
    return NextResponse.json({ error: "Chyba serveru při aktualizaci akce." }, { status: 500 });
  }
}

// DELETE – smaže akci a související registrace a termíny
export async function DELETE(_request: Request, context: Context) {
  const id = Number(context.params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Neplatné ID akce." }, { status: 400 });
  }

  try {
    await prisma.$transaction([
      prisma.registration.deleteMany({ where: { eventId: id } }),
      prisma.eventDate.deleteMany({ where: { eventId: id } }),
      prisma.event.delete({ where: { id } }),
    ]);

    revalidatePath("/"); // ZMĚNA ZDE: Přidána revalidace po smazání

    return NextResponse.json({ message: "Akce a všechny návaznosti byly smazány." });
  } catch (error) {
    console.error("❌ Chyba při mazání akce:", error);
    return NextResponse.json({ error: "Chyba serveru při mazání akce." }, { status: 500 });
  }
}
