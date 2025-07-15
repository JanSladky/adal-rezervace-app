import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as Blob;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadPromise = new Promise<{ secure_url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "events" },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result as { secure_url: string });
        }
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });

  try {
    const result = await uploadPromise;
    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}