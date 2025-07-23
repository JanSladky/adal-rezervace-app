// src/app/api/registrations/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendPaymentConfirmationEmail } from "@/lib/email";

type Context = {
  params: { id: string };
};

/**
 * Označí registraci jako zaplacenou a pošle potvrzovací e-mail.
 */
export async function PATCH(
  request: Request,
  { params }: Context
) {
  const regId = Number(params.id);
  if (isNaN(regId)) {
    return NextResponse.json(
      { error: "Neplatné ID registrace." },
      { status: 400 }
    );
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
      return NextResponse.json(
        { error: "Registrace nebyla nalezena." },
        { status: 404 }
      );
    }

    await sendPaymentConfirmationEmail({
      registrationId: registration.id,
      userName: registration.name,
      userEmail: registration.email,
      eventName: registration.event.name,
      eventLocation: registration.event.location,
      eventDate: registration.eventDate.date.toISOString(),
    });

    return NextResponse.json({ message: "Označeno jako zaplaceno." });
  } catch (err) {
    console.error("Chyba při označování platby:", err);
    return NextResponse.json(
      { error: "Chyba při označování platby." },
      { status: 500 }
    );
  }
}

/**
 * Smaže registraci (uvolní tak kapacitu).
 */
export async function DELETE(
  request: Request,
  { params }: Context
) {
  const regId = Number(params.id);
  if (isNaN(regId)) {
    return NextResponse.json(
      { error: "Neplatné ID registrace." },
      { status: 400 }
    );
  }

  try {
    await prisma.registration.delete({ where: { id: regId } });
    return NextResponse.json({ message: "Registrace smazána." });
  } catch (err) {
    // Typově bezpečnější kontrola kódu chyby
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "P2025"
    ) {
      // Záznam neexistuje
      return NextResponse.json(
        { error: "Registrace k smazání nebyla nalezena." },
        { status: 404 }
      );
    }
    console.error("Chyba při mazání registrace:", err);
    return NextResponse.json(
      { error: "Chyba při mazání registrace." },
      { status: 500 }
    );
  }
}