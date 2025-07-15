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

// Typy můžete upravit podle toho, co posíláte:
type RegistrationData = {
  userName: string;
  userEmail: string;
  attendees: number;
  eventName: string;
  eventLocation: string;
  eventDate: string; // ISO nebo už formátovaný string
  adminEmail: string;
  variableSymbol: string;
  amountCZK: number;
  qrCodeUrl?: string;
};

export async function sendRegistrationEmails(data: RegistrationData) {
  // Pro uživatele:
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

  // Pro administrátora:
  await transporter.sendMail({
    from: `"Vaše Aplikace" <${process.env.SMTP_USER}>`,
    to: data.adminEmail,
    subject: `Nová registrace na akci ${data.eventName}`,
    text: `
Dobrý den,

Na akci ${data.eventName}, termín ${data.eventDate}, se právě registroval nový účastník:

Jméno: ${data.userName}
E-mail: ${data.userEmail}
Počet osob: ${data.attendees}

Přihlášeno přes systém.
    `,
  });
}