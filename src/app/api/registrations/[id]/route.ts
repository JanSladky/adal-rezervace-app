import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

import {
  sendPaymentConfirmationEmail,
  sendCancellationEmail,
} from "../../../../lib/email";

type Context = {
  params: { id: string };
};

// PATCH – označí jako zaplacenou a odešle e-mail s QR kódem
export async function PATCH(request: Request, context: Context) {
  const regId = Number(context.params.id);
  if (isNaN(regId)) {
    return NextResponse.json({ error: "Neplatné ID registrace." }, { status: 400 });
  }

  try {
    const registration = await prisma.registration.update({
      where: { id: regId },
      data: { paid: true },
      include: {
        event: { select: { name: true, location: true } },
        eventDate: true,
      },
    });

    if (!registration) {
      return NextResponse.json({ error: "Rezervace nebyla nalezena." }, { status: 404 });
    }

    // Vygeneruj QR kód s odkazem na check-in stránku
    const checkinUrl = `${process.env.APP_URL}/checkin/${registration.id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(checkinUrl);

    await sendPaymentConfirmationEmail({
      registrationId: registration.id,
      userName: registration.name,
      userEmail: registration.email,
      eventName: registration.event.name,
      eventLocation: registration.event.location,
      eventDate: registration.eventDate.date.toISOString(),
      qrCodeUrl: qrCodeDataUrl,
    });

    return NextResponse.json({ message: "Označeno jako zaplaceno." });
  } catch (err) {
    console.error("Chyba při označování platby:", err);
    return NextResponse.json({ error: "Chyba při označování platby." }, { status: 500 });
  }
}

// DELETE – smaže registraci a pošle email
export async function DELETE(request: Request, context: Context) {
  const regId = Number(context.params.id);
  if (isNaN(regId)) {
    return NextResponse.json({ error: "Neplatné ID registrace." }, { status: 400 });
  }

  try {
    const registration = await prisma.registration.findUnique({
      where: { id: regId },
      include: {
        event: { select: { name: true, location: true } },
        eventDate: true,
      },
    });

    if (!registration) {
      return NextResponse.json({ error: "Rezervace nebyla nalezena." }, { status: 404 });
    }

    await prisma.registration.delete({ where: { id: regId } });

    if (registration.email) {
      await sendCancellationEmail({
        userName: registration.name,
        userEmail: registration.email,
        eventName: registration.event.name,
        eventLocation: registration.event.location,
        eventDate: registration.eventDate.date.toISOString(),
      });
    }

    return NextResponse.json({ message: "Registrace smazána." });
  } catch (err) {
    console.error("Chyba při mazání registrace:", err);
    return NextResponse.json({ error: "Chyba při mazání registrace." }, { status: 500 });
  }
}

// PUT – úprava akce (event)
export async function PUT(request: Request, context: Context) {
  const id = Number(context.params.id);
  const { name, location, description, difficulty, image, duration } = await request.json();

  if (!name || !location || !description || !difficulty || !image || typeof duration !== "string" || duration.trim() === "") {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { name, location, description, difficulty, image, duration },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("❌ Server error:", error);
    const message = error instanceof Error ? error.message : "Chyba při aktualizaci.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET – detail akce
export async function GET(request: Request, context: Context) {
  const id = Number(context.params.id);

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { eventDates: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("❌ Chyba při načítání:", error);
    const message = error instanceof Error ? error.message : "Chyba při načítání.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}