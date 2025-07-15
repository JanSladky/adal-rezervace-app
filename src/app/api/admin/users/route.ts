import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

// Typy pro vstupní data
type NewUserPayload = {
  email: string;
  password: string;
  isAdmin: boolean;
};

type DeleteUserPayload = {
  id: number;
};

// GET – načtení všech uživatelů
export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, isAdmin: true },
  });
  return NextResponse.json(users);
}

// POST – přidání nového uživatele
export async function POST(request: Request) {
  const { email, password, isAdmin }: NewUserPayload = await request.json();

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, isAdmin },
  });

  return NextResponse.json({ message: "User created", user });
}

// DELETE – smazání uživatele
export async function DELETE(request: Request) {
  const { id }: DeleteUserPayload = await request.json();

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ message: "User deleted" });
}