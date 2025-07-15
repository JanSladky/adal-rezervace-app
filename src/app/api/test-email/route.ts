import { NextResponse } from "next/server";
import { sendRegistrationEmails } from "@/lib/email";

export async function GET() {
  await sendRegistrationEmails({
    userName: "Jan Sladký",
    userEmail: "sladky.honza@gmail.com",
    attendees: 2,
    eventName: "Ukázková akce",
    eventLocation: "Žatec",
    eventDate: new Date().toLocaleString("cs-CZ"),
    adminEmail: "sladky.honza@gmail.com", // ideálně z process.env.ADMIN_EMAIL
    variableSymbol: "123456",
    amountCZK: 500,
    qrCodeUrl: "https://example.com/qr.png", // může být prázdné
  });

  return NextResponse.json({ message: "Testovací e-maily odeslány!" });
}