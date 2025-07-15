import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, date, capacity } = await request.json();

  const event = await prisma.event.create({
    data: {
      name,
      date: new Date(date),
      capacity: Number(capacity),
    },
  });

  return NextResponse.json(event);
}