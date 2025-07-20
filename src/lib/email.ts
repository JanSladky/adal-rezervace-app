// src/lib/email.ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ================================
// 1) Odeslání e-mailu po registraci
// ================================
export type RegistrationData = {
  userName: string;
  userEmail: string;
  attendees: number;
  eventName: string;
  eventLocation: string;
  eventDate: string; // ISO string nebo již formátovaný
  adminEmail: string;
  variableSymbol: string;
  amountCZK: number;
  qrCodeUrl?: string;
};

export async function sendRegistrationEmails(data: RegistrationData) {
  // E-mail uživateli
  await transporter.sendMail({
    from: `"Vaše Aplikace" <${process.env.SMTP_USER}>`,
    to: data.userEmail,
    subject: `Potvrzení registrace na akci ${data.eventName}`,
    html: `
      <p>Dobrý den ${data.userName},</p>
      <p>děkujeme za Vaši registraci na akci <strong>${data.eventName}</strong>.</p>
      <p><strong>Termín:</strong> ${data.eventDate}</p>
      <p><strong>Místo konání:</strong> ${data.eventLocation}</p>
      <p><strong>Počet osob:</strong> ${data.attendees}</p>
      <p><strong>Platba:</strong> ${data.amountCZK} Kč, variabilní symbol: ${data.variableSymbol}</p>
      ${data.qrCodeUrl ? `<p><img src="${data.qrCodeUrl}" alt="QR Platba" width="200" /></p>` : ""}
      <p>Děkujeme a těšíme se na Vás!</p>
    `,
  });

  // E-mail administrátorovi
  await transporter.sendMail({
    from: `"Vaše Aplikace" <${process.env.SMTP_USER}>`,
    to: data.adminEmail,
    subject: `Nová registrace na akci ${data.eventName}`,
    text: `
Dobrý den,

Na akci ${data.eventName} (${data.eventDate}) se právě registroval nový účastník:

Jméno: ${data.userName}
E-mail: ${data.userEmail}
Počet osob: ${data.attendees}

Přihlášeno přes systém.
    `,
  });
}

// ================================================
// 2) Odeslání e-mailu po potvrzení platby registrace
// ================================================
export interface PaymentConfirmationData {
  registrationId: number;
  userName: string;
  userEmail: string;
  eventName: string;
  eventLocation: string;
  eventDate: string; // ISO string
}

export async function sendPaymentConfirmationEmail({ registrationId, userName, userEmail, eventName, eventLocation, eventDate }: PaymentConfirmationData) {
  // E-mail uživateli
  await transporter.sendMail({
    from: `"Vaše Aplikace" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: `Potvrzení platby – ${eventName}`,
    html: `
      <p>Dobrý den ${userName},</p>
      <p>vaše platba za registraci č. <strong>${registrationId}</strong> na akci <strong>${eventName}</strong> (${new Date(eventDate).toLocaleString(
      "cs-CZ"
    )}) byla úspěšně přijata.</p>
      <p>Těšíme se na vás na místě konání: ${eventLocation}.</p>
    `,
  });

  // (Volitelně) notifikace administrátorovi
  await transporter.sendMail({
    from: `"Vaše Aplikace" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Platba přijata – registrace ${registrationId}`,
    text: `
Administrátor,

byla přijata platba za registraci č. ${registrationId}
Akce: ${eventName} (${new Date(eventDate).toLocaleString("cs-CZ")})
    `,
  });
}
