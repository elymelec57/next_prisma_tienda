// src/app/api/employees/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../libs/prisma';
import { authorizeRequest } from '../../../../libs/auth';

export async function GET(request) {
  try {
    const { authorized, error, status, restaurant } = await authorizeRequest(request);
    if (!authorized) {
      return NextResponse.json({ error }, { status });
    }

    const employees = await prisma.empleado.findMany({
      where: { restaurantId: restaurant.id },
      include: {
        rol: true,
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { authorized, error, status, restaurant } = await authorizeRequest(request);
    if (!authorized) {
      return NextResponse.json({ error }, { status });
    }

    const { nombre, apellido, telefono, rolId, userId: employeeUserId } = await request.json();

    const newEmployee = await prisma.empleado.create({
      data: {
        nombre,
        apellido,
        telefono,
        rolId,
        userId: employeeUserId,
        restaurantId: restaurant.id,
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
