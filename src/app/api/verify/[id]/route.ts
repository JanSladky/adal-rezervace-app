import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { registrations, events, eventDates } from "../../../../lib/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid registration ID" }, { status: 400 });
  }

  try {
    const [result] = await db
      .select({
        userName: registrations.name,
        eventName: events.name,
        eventDate: eventDates.date,
        eventLocation: events.location,
        isPaid: registrations.paid,
      })
      .from(registrations)
      .where(eq(registrations.id, id))
      .innerJoin(events, eq(registrations.eventId, events.id))
      .innerJoin(eventDates, eq(registrations.eventDateId, eventDates.id))
      .limit(1);

    if (!result) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({
      userName: result.userName,
      eventName: result.eventName,
      eventDate: result.eventDate,
      eventLocation: result.eventLocation,
      isPaid: result.isPaid,
    });
  } catch (error) {
    console.error("❌ API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}