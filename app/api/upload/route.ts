import { NextRequest, NextResponse } from "next/server";

async function postHandler(req: NextRequest) {
  const data = await req.formData();

  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const path = `/tmp/${file.name}`;

  return NextResponse.json({});
}

export const POST = postHandler;

export const runtime = "edge";
