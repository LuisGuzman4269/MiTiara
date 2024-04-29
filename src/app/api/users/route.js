import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from 'bcryptjs';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { checkLoggedIn } from "@/lib/auth";

export async function POST(request) {
  const data = await request.json();
  const { email, password, displayName, phone, role, favorites, id } = data;
  if (email && password && displayName) {
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    try {
      user = await prisma.User.create({
        data: {
          email,
          password: hashedPassword,
          displayName,
          phone,
          role
        }
      });
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json(user);
  }
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    if (email && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      let user;
      try {
        user = await prisma.user.update({
          where: { email },
          data: { password: hashedPassword },
        });
        return NextResponse.json({ message: 'Password reset successfully' });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    if (id && displayName && phone) {
      let user;
      try {
        user = await prisma.user.update({
          where: { id },
          data: { displayName: displayName, phone: phone },
        });
        return NextResponse.json({ message: 'Profile updated successfully' });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    if (id) {
      let user;
      try {
        const existingUser = await prisma.user.findUnique({
          where: { id },
          include: { favorites: true }
        });
        const updatedFavorites = existingUser.favorites.some(service => service.id === favorites[0].id) ?
          { disconnect: favorites.map(service => ({ id: service.id })) } :
          { connect: favorites.map(service => ({ id: service.id })) };
        user = await prisma.user.update({
          where: { id },
          data: { favorites: updatedFavorites },
        });
        const message = existingUser.favorites.some(service => service.id === favorites[0].id) ?
          'Removed service from favorites' :
          'Added service to favorites';
        return NextResponse.json({ message });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }
  return NextResponse.json({ error: 'Email, Password, or DisplayName not defined' }, { status: 500 });
}


export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        bookings: true,
        reviews: true,
        notifications: true,
        services: true,
        favorites: true
      }
    });
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}