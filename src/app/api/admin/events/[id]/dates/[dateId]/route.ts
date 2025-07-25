import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT – úprava termínu
export async function PUT(
  request: Request,
  { params }: { params: { id: string; dateId: string } }
) {
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

// DELETE – smazání termínu
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; dateId: string } }
) {
  const dateId = Number(params.dateId);

  if (isNaN(dateId)) {
    return NextResponse.json({ error: "Neplatné ID termínu." }, { status: 400 });
  }

  try {
    await prisma.eventDate.delete({
      where: { id: dateId },
    });

    return NextResponse.json({ message: "Termín byl úspěšně smazán." });
  } catch (error) {
    console.error("❌ Chyba při mazání termínu:", error);
    return NextResponse.json({ error: "Chyba při mazání termínu." }, { status: 500 });
  }
}