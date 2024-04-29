import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const types = await prisma.type.findMany();
    return NextResponse.json({ types });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
