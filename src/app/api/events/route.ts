import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, date, capacity, image, location, description, difficulty } = await request.json();

  if (!name || !date || !capacity || !image || !location || !description || !difficulty) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const event = await prisma.event.create({
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

    return NextResponse.json(event);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při ukládání do databáze." }, { status: 500 });
  }
}