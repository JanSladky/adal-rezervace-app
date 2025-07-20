// src/app/api/registrations/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendPaymentConfirmationEmail } from "@/lib/email";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const regId = Number(params.id);
  if (isNaN(regId)) {
    return NextResponse.json(
      { error: "Neplatné ID registrace." },
      { status: 400 }
    );
  }

  try {
    // 1) Označíme platbu
    const registration = await prisma.registration.update({
      where: { id: regId },
      data: { paid: true },
      include: {
        event: { select: { name: true, location: true } },
        eventDate: true,
      },
    });

    // 2) Pošleme potvrzení e-mailem
    //    Ujistěte se, že máte v .env nastavené ADMIN_EMAIL
    await sendPaymentConfirmationEmail({
      registrationId: registration.id,
      userName:        registration.name,
      userEmail:       registration.email,
      eventName:       registration.event.name,
      eventLocation:   registration.event.location,
      eventDate:       registration.eventDate.date.toISOString(),
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
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
    console.error("Chyba při mazání registrace:", err);
    return NextResponse.json(
      { error: "Chyba při mazání registrace." },
      { status: 500 }
    );
  }
}