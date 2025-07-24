// src/app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { sendRegistrationEmails } from "@/lib/email";

export async function GET() {
  await sendRegistrationEmails({
    userName: "Jan Sladký",
    userEmail: "sladky.honza@gmail.com",
    attendees: 2,
    eventName: "Ukázková akce",
    eventLocation: "Žatec",
    eventDate: "2025-08-10",
    adminEmail: "sladky.honza@gmail.com",
    variableSymbol: "20250810001",
    amountCZK: 300,
    accountNumber: "123456789/0100",
    qrCodeUrl: "", // ⛔️ NEPOTŘEBUJEŠ – QR kód se generuje v email.ts
  });

  return NextResponse.json({ success: true });
}