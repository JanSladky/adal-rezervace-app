import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Context = {
  params: { id: string };
};

export async function DELETE(_request: Request, { params }: Context) {
  const id = Number(params.id);

  try {
    await prisma.$transaction([
      prisma.registration.deleteMany({
        where: { eventId: id },
      }),
      prisma.eventDate.deleteMany({
        where: { eventId: id },
      }),
      prisma.event.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({ message: "Akce a všechny návaznosti byly smazány." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při mazání akce." }, { status: 500 });
  }
}