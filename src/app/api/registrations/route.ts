import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generatePaymentQR } from "@/lib/qr";
import { sendRegistrationEmails } from "@/lib/email";

export async function POST(request: Request) {
  const { eventId, eventDateId, name, email, attendees } = await request.json();

  if (!eventId || !eventDateId || !name || !email || !attendees) {
    return NextResponse.json({ error: "Chybí požadovaná pole." }, { status: 400 });
  }

  try {
    // 1️⃣ Uložit registraci
    await prisma.registration.create({
      data: {
        eventId: Number(eventId),
        eventDateId: Number(eventDateId),
        name,
        email,
        attendees: Number(attendees),
      },
    });

    // 2️⃣ Načíst informace o akci a termínu z DB
    const [event, eventDate] = await Promise.all([
      prisma.event.findUnique({
        where: { id: Number(eventId) },
        select: {
          name: true,
          location: true,
          amountCZK: true,
          variableSymbol: true,
          accountNumber: true,
        },
      }),
      prisma.eventDate.findUnique({
        where: { id: Number(eventDateId) },
        select: {
          date: true,
        },
      }),
    ]);

    if (!event || !eventDate) {
      return NextResponse.json({ error: "Akce nebo termín nenalezen." }, { status: 404 });
    }

    // 3️⃣ Spočítat celkovou cenu podle počtu osob
    const totalAmount = event.amountCZK * Number(attendees);

    // 4️⃣ Vygenerovat QR kód (ve formátu data:image/svg+xml;base64,...)
    const qrCodeUrl = generatePaymentQR(totalAmount, event.variableSymbol, event.accountNumber);

    // 5️⃣ Odeslat e-mail s QR kódem
    await sendRegistrationEmails({
      userName: name,
      userEmail: email,
      attendees: Number(attendees),
      eventName: event.name,
      eventLocation: event.location,
      eventDate: eventDate.date.toLocaleString("cs-CZ"),
      adminEmail: process.env.ADMIN_EMAIL!,
      variableSymbol: event.variableSymbol,
      amountCZK: totalAmount,
      accountNumber: event.accountNumber,
      qrCodeUrl, // předáváme QR pro e-mail
    });

    // 6️⃣ Vrátit QR kód i do frontendu
    return NextResponse.json({
      message: "Registrace úspěšná.",
      qrCodeUrl,
      amountCZK: totalAmount,
      variableSymbol: event.variableSymbol,
      accountNumber: event.accountNumber,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při registraci." }, { status: 500 });
  }
}
