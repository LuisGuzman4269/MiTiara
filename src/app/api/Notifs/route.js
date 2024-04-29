import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const notification = await prisma.notification.findMany();
    return NextResponse.json({ notification });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const data = await request.json();
    const { title, description, dismissed, start, bookingID, userID } =
      data;

    const notif = await prisma.notification.create({
      data: {
        title,
        description,
        dismissed,
        start,
        booking: {
          connect: { id: bookingID },
        },
        user: {
          connect: { id: userID },
        },
      },
    });

    return NextResponse.json({ status: 200, notification: notif });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { status: 500 },
      { body: { message: "Internal Server Error" } }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, dismissed} = data;

    // Update the booking with the specified id
    const updated = await prisma.notification.update({
      where: { id },
      data: {
        dismissed
      },
    });

    return NextResponse.json({ status: 200, notification: updated });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { status: 500 },
      { body: { message: "Internal Server Error" } }
    );
  }
}
