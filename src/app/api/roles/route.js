import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const roles = await prisma.rol.findMany();
    return NextResponse.json(roles);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_TOKEN);

    const { nombre } = await request.json();

    if (!nombre) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newRole = await prisma.rol.create({
      data: {
        nombre,
      },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
