import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const valid = await compare(password, user.password);

  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  if (!user.isAdmin) {
    return NextResponse.json({ error: "Not admin" }, { status: 403 });
  }

  const response = NextResponse.json({ message: "Success" });

  response.cookies.set("admin-auth", "true", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}