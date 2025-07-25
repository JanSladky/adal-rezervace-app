// src/lib/generateQRCodeWithURL.ts
import QRCode from "qrcode";

export async function generateQRCodeWithURL(url: string): Promise<Buffer> {
  return await QRCode.toBuffer(url);
}