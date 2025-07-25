import { db } from "@/lib/db";
import { registrations } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db.select().from(registrations).limit(10);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "DB dotaz selhal", detail: error }, { status: 500 });
  }
}