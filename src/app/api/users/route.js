// src/app/api/users/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../libs/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_TOKEN);

    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
