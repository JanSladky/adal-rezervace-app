import { NextResponse } from "next/server";


export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("admin-auth", "", {
    maxAge: 0,
    path: "/",
  });

  return response;
}