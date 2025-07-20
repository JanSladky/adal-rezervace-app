import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST = vytvoření nové akce
export async function POST(request: Request) {
  const { name, image, location, description, difficulty, amountCZK, variableSymbol, accountNumber } = await request.json();

  if (!name || !image || !location || !description || !difficulty || !amountCZK || !variableSymbol || !accountNumber) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const event = await prisma.event.create({
      data: {
        name,
        image,
        location,
        description,
        difficulty,
        amountCZK: Number(amountCZK),
        variableSymbol,
        accountNumber,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při ukládání do databáze." }, { status: 500 });
  }
}

// GET = načtení všech akcí včetně termínů
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        location: true,
        description: true,
        difficulty: true,
        amountCZK: true,
        variableSymbol: true,
        accountNumber: true,
        eventDates: {
          select: {
            id: true,
            date: true,
            capacity: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při načítání akcí." }, { status: 500 });
  }
}
