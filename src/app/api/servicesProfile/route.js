import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        type: true,
        vendor: true
      }
    });
    return NextResponse.json({ services });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const data = await request.json();

    const {
      id,
      name,
      description,
      minPrice,
      maxPrice,
      address,
      typeID,
      vendorID,
      image,
    } = data;

    if (id) {
      // Update existing service
      const updatedService = await prisma.Service.update({
        where: { id },
        data: {
          name,
          description,
          minPrice,
          maxPrice,
          address,
        },
      });

      return NextResponse.json({ status: 200, service: updatedService });
    } else {
      // Create new service
      const newService = await prisma.Service.create({
        data: {
          minPrice,
          maxPrice,
          address,
          description,
          name,
          vendor: {
            connect: { id: vendorID },
          },
          type: {
            connect: { id: typeID },
          },
        },
      });

      if (image && image.data) {
        const buffer = Buffer.from(image.data, 'base64');
        const fileName = `${newService.id}.png`;
        const filePath = path.join(process.cwd(), 'public', 'images', 'vendor', fileName);

        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        await fs.promises.writeFile(filePath, buffer);

        // Update the service with the image path
        await prisma.Service.update({
          where: { id: newService.id },
          data: { image: filePath },
        });
      }

      return NextResponse.json({ status: 200, service: newService });
    }
  } catch (error) {
    console.error("Error creating/updating service:", error);
    return NextResponse.json(
      { status: 500 },
      { body: { message: "Internal Server Error" } }
    );
  }
}


export async function DELETE(request) {
  const data = await request.json();
  const { id } = data;
  try {
    // Retrieve the service including the image path
    const service = await prisma.service.findUnique({
      where: { id },
      select: {
        image: true
      }
    });

    // Delete the service from the database
    await prisma.service.delete({
      where: { id },
    });

    if (service && service.image) {
      await fs.promises.unlink(service.image);
    }

    return NextResponse.json({ status: 200, service: id });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { status: 500 },
      { body: { message: "Internal Server Error" } }
    );
  }
}

