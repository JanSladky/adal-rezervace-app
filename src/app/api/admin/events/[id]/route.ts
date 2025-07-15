import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Context = {
  params: { id: string };
};

export async function DELETE(_request: Request, { params }: Context) {
  try {
    await prisma.event.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "Akce byla smazána." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při mazání akce." }, { status: 500 });
  }
}