// src/lib/generatePaymentQR.ts
import qr from "qr-image";

/**
 * Vygeneruje QR kód pro platbu ve formátu PNG (Buffer),
 * vhodný pro přiložení do e-mailu jako obrázek.
 *
 * @param amountCZK - částka v Kč
 * @param variableSymbol - variabilní symbol
 * @param account - číslo účtu ve formátu 123456789/0100
 * @returns Buffer s PNG QR kódem
 */
export function generatePaymentQR(amountCZK: number, variableSymbol: string, account: string): Buffer {
  const payload = `
SPD*1.0*ACC:${account}*AM:${amountCZK.toFixed(2)}*CC:CZK*X-VS:${variableSymbol}
  `.trim();

  const qrPng = qr.imageSync(payload, { type: "png", size: 10, margin: 2 }) as Buffer;
  return qrPng;
}