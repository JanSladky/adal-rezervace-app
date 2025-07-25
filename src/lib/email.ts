import nodemailer from "nodemailer";
import { generateQRCodeWithURL } from "./generateQRCodeWithURL"; // Nová funkce, generuje QR kód s URL (např. https://example.com/verify/123)
import { db } from "./db";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export type RegistrationData = {
  userName: string;
  userEmail: string;
  attendees: number;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  adminEmail: string;
  variableSymbol: string;
  amountCZK: number;
  accountNumber: string;
  qrCodeUrl: string;
};

export async function sendRegistrationEmails(data: RegistrationData) {
  await transporter.sendMail({
    from: `"Adál – potvrzení registrace" <${process.env.SMTP_USER}>`,
    to: data.userEmail,
    subject: `Potvrzení registrace na akci ${data.eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; background: #fff; padding: 24px; max-width: 600px; margin: auto; border-radius: 8px;">
        <h2 style="color: #111; font-size: 20px;">Potvrzení registrace</h2>

        <p>Dobrý den <strong>${data.userName}</strong>,</p>
        <p>děkujeme za Vaši registraci na akci <strong>${data.eventName}</strong>.</p>
        <h3 style="margin-top: 32px; font-size: 18px;">💸 Informace o akci</h3>
        <div style="background-color:#f4f4f5;border-left:5px solid #ff7f00;padding:16px;margin-bottom:24px;border-radius:6px;">
          <p style="margin:0;">
            📅 <strong>Termín:</strong> ${data.eventDate}<br/>
            📍 <strong>Místo konání:</strong> ${data.eventLocation}<br/>
            👥 <strong>Počet osob:</strong> ${data.attendees}
          </p>
        </div>

        <h3 style="margin-top: 32px; font-size: 18px;">💸 Údaje k platbě</h3>
        <div style="padding: 12px 16px; background-color: #f4f4f5; border-left: 5px solid #ff7f00; border-radius: 6px;">
          <p style="margin: 6px 0;"><strong>💰 Částka:</strong> ${data.amountCZK.toFixed(2)} Kč</p>
          <p style="margin: 6px 0;"><strong>🏦 Číslo účtu:</strong> ${data.accountNumber}</p>
          <p style="margin: 6px 0;"><strong>🧾 Variabilní symbol:</strong> ${data.variableSymbol}</p>
        </div>

        <p style="font-size: 14px; color: #555;"><em>Platbu prosím odešlete do 3 dnů.</em></p>

        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="font-size: 14px;">Děkujeme a těšíme se na Vás!<br/>Tým A dál?</p>
      </div>
    `,
  });

  await transporter.sendMail({
    from: `"Nová registrace – ${data.eventName}" <${process.env.SMTP_USER}>`,
    to: data.adminEmail,
    subject: `Nová registrace na akci ${data.eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; background: #fff; padding: 24px; max-width: 600px; margin: auto; border-radius: 8px;">
        <h2 style="font-size: 20px;">📥 Nová registrace</h2>
        <p>Na akci <strong>${data.eventName}</strong> (<strong>${data.eventDate}</strong>) se právě registroval nový účastník:</p>
        <ul>
          <li><strong>👤 Jméno:</strong> ${data.userName}</li>
          <li><strong>📧 E-mail:</strong> ${data.userEmail}</li>
          <li><strong>👥 Počet osob:</strong> ${data.attendees}</li>
        </ul>
        <p style="font-size: 14px; color: #555;">Zapsáno přes registrační systém.</p>
      </div>
    `,
  });
}

export interface PaymentConfirmationData {
  registrationId: number;
  userName: string;
  userEmail: string;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  qrCodeUrl: string;
}

export async function sendPaymentConfirmationEmail({ registrationId, userName, userEmail, eventName, eventLocation, eventDate }: PaymentConfirmationData) {
  const verificationUrl = `${process.env.APP_URL}/verify/${registrationId}`;
  const qrCodeBuffer = await generateQRCodeWithURL(verificationUrl);

  await transporter.sendMail({
    from: `"A dál? - potvrzení platby" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: `Potvrzení platby – ${eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; background: #fff; padding: 24px; max-width: 600px; margin: auto; border-radius: 8px;">
        <h2 style="color: #111; font-size: 20px;">✅ Platba přijata</h2>
        <p>Dobrý den <strong>${userName}</strong>,</p>
        <p>Vaše platba za registraci na akci <strong>${eventName}</strong> (${new Date(eventDate).toLocaleString("cs-CZ")}) byla úspěšně přijata.</p>
        <p>Na místě se prosím prokažte tímto QR kódem:</p>
        <p><img src="cid:qr-code" width="200" style="border: 1px solid #ccc; padding: 4px;" /></p>
        <p style="font-size: 14px;">Odkaz pro kontrolu: <a href="${verificationUrl}">${verificationUrl}</a></p>
        <p style="margin-top: 24px; font-size: 14px;">Děkujeme,<br/>Tým A dál?</p>
      </div>
    `,
    attachments: [
      {
        filename: "verify-qr.png",
        content: qrCodeBuffer,
        cid: "qr-code",
        contentType: "image/png",
      },
    ],
  });

  await transporter.sendMail({
    from: `"A dál?" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Platba přijata – registrace ${registrationId}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; background: #fff; padding: 24px; max-width: 600px; margin: auto; border-radius: 8px;">
        <h2 style="font-size: 20px;">💰 Platba přijata</h2>
        <p>Byla potvrzena platba za registraci:</p>
        <ul>
          <li><strong>ID:</strong> ${registrationId}</li>
          <li><strong>Jméno:</strong> ${userName}</li>
          <li><strong>Akce:</strong> ${eventName}</li>
          <li><strong>Datum:</strong> ${new Date(eventDate).toLocaleString("cs-CZ")}</li>
        </ul>
      </div>
    `,
  });
}

export interface CancellationEmailData {
  userName: string;
  userEmail: string;
  eventName: string;
  eventLocation: string;
  eventDate: string;
}

export async function sendCancellationEmail({ userName, userEmail, eventName, eventLocation, eventDate }: CancellationEmailData) {
  await transporter.sendMail({
    from: `"A dál? - zrušení registrace" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: `Zrušení registrace – ${eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; background: #fff; padding: 24px; max-width: 600px; margin: auto; border-radius: 8px;">
        <h2 style="color: #b91c1c;">❌ Zrušení registrace</h2>
        <p>Dobrý den <strong>${userName}</strong>,</p>
        <p>bohužel jsme museli zrušit Vaši registraci na akci <strong>${eventName}</strong>, která se měla konat dne <strong>${new Date(
      eventDate
    ).toLocaleString("cs-CZ")}</strong> na místě <strong>${eventLocation}</strong>.</p>
        <p>Důvodem je neobdržená platba a potřeba uvolnit místo dalším účastníkům.</p>
        <p>Pokud se jedná o nedorozumění, neváhejte nás kontaktovat.</p>
        <p style="margin-top: 24px; font-size: 14px;">Děkujeme za pochopení,<br/>Tým A dál?</p>
      </div>
    `,
  });
}
