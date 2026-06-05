// ============================================================
// FILE: src/app/api/mock/messages/route.ts
// ============================================================
import { NextResponse } from "next/server";
import data from "@/data/dashboard.json";

export async function GET(): Promise<NextResponse> {
  await new Promise((r) => setTimeout(r, 400));
  return NextResponse.json(data.messages);
}