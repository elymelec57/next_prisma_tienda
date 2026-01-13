
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import bcrypt from 'bcryptjs';
import { authorizeRequest } from '@/libs/auth'

export async function GET(request) {
  try {
    const user = await authorizeRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employees = await prisma.empleado.findMany({
      where: { restaurantId: user.auth.restauranteId },
      include: {
        rol: true,
      },
      orderBy: { nombre: 'asc' }
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await authorizeRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { nombre, apellido, telefono, email, password, rolId } = await request.json();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newEmployee = await prisma.empleado.create({
      data: {
        nombre,
        apellido,
        telefono,
        email,
        password: hashedPassword,
        rolId,
        userId: user.auth.id,
        restaurantId: user.auth.restauranteId,
      },
      include: {
        rol: true
      }
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
