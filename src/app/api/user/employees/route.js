
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'

async function getRestaurantId() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    return decoded.data.restauranteId
  } catch (err) {
    return null
  }
}

export async function GET(request) {
  try {
    const restaurantId = await getRestaurantId()
    if (!restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employees = await prisma.empleado.findMany({
      where: { restaurantId },
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
    const restaurantId = await getRestaurantId()
    if (!restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { nombre, apellido, telefono, rolId, userId: employeeUserId } = await request.json();

    const newEmployee = await prisma.empleado.create({
      data: {
        nombre,
        apellido,
        telefono,
        rolId,
        userId: employeeUserId,
        restaurantId,
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
