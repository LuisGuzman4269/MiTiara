import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany();
    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const data = await request.json();
    const { status, hasBeenConfirmed, start, end, price, custID, serviceID } =
      data;

    // Create service without image first
    const newBooking = await prisma.Booking.create({
      data: {
        status,
        hasBeenConfirmed,
        start,
        end,
        price,
        customer: {
          connect: { id: custID },
        },
        service: {
          connect: { id: serviceID },
        },
      },
    });

    return NextResponse.json({ status: 200, booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { status: 500 },
      { body: { message: "Internal Server Error" } }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, status, hasBeenConfirmed } = data;

    // Update the booking with the specified id
    const updatedBooking = await prisma.Booking.update({
      where: { id },
      data: {
        status,
        hasBeenConfirmed,
      },
    });

    return NextResponse.json({ status: 200, booking: updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { status: 500 },
      { body: { message: "Internal Server Error" } }
    );
  }
}
