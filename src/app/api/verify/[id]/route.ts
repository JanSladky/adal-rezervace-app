import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { registrations } from "../../../../lib/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid registration ID" }, { status: 400 });
  }

  try {
    const [registration] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, id))
      .limit(1);

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({
      userName: registration.name,
      eventName: registration.eventName,
      eventDate: registration.eventDate,
      eventLocation: registration.eventLocation,
      isPaid: !!registration.isPaid,
    });
  } catch (error) {
    console.error("❌ API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}