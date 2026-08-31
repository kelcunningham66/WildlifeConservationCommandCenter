import { NextResponse } from "next/server";
import { analyzeFeatures, hashBuffer } from "@/lib/analyze";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("image");
  const luminance = Number(form.get("luminance") ?? "");
  const greenRatio = Number(form.get("greenRatio") ?? "");
  const warmRatio = Number(form.get("warmRatio") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload a camera-trap image." }, { status: 400 });
  }

  if (file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be under 12 MB." }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const detection = analyzeFeatures({
    hash: hashBuffer(buf),
    filename: file.name,
    byteLength: buf.length,
    luminance: Number.isFinite(luminance) ? luminance : undefined,
    greenRatio: Number.isFinite(greenRatio) ? greenRatio : undefined,
    warmRatio: Number.isFinite(warmRatio) ? warmRatio : undefined,
  });

  return NextResponse.json({
    filename: file.name,
    bytes: file.size,
    detection,
  });
}
