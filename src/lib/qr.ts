import qr from "qr-image";

export function generatePaymentQR(amountCZK: number, variableSymbol: string, account: string) {
  const payload = `
SPD*1.0*ACC:${account}*AM:${amountCZK.toFixed(2)}*CC:CZK*X-VS:${variableSymbol}
  `.trim();

  const qrSvg = qr.imageSync(payload, { type: "svg" });

  return `data:image/svg+xml;base64,${Buffer.from(qrSvg).toString("base64")}`;
}