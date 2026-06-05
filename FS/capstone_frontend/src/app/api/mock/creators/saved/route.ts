// ============================================================
// FILE: src/app/api/mock/creators/saved/route.ts
// ============================================================
import { NextResponse } from "next/server";
import data from "@/data/dashboard.json";

export async function GET(): Promise<NextResponse> {
  await new Promise((r) => setTimeout(r, 500));
  return NextResponse.json(data.savedCreators);
}