import { NextResponse } from "next/server";
import { mongoConnect } from "@/lib/mongo";
export const runtime = "nodejs";
export async function GET() {
  await mongoConnect();
  return NextResponse.json({ ok: true });
}
