
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

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const restaurantId = await getRestaurantId()
    if (!restaurantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify employee belongs to restaurant
    const employee = await prisma.empleado.findUnique({
      where: { id: parseInt(id), restaurantId }
    })
    if (!employee) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const schedules = await prisma.empleadoHorario.findMany({
      where: { empleadoId: parseInt(id) },
      orderBy: { startTime: 'asc' }
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const restaurantId = await getRestaurantId()
    if (!restaurantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify employee belongs to restaurant
    const employee = await prisma.empleado.findUnique({
      where: { id: parseInt(id), restaurantId }
    })
    if (!employee) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { startTime, endTime } = await request.json();

    const newSchedule = await prisma.empleadoHorario.create({
      data: {
        empleadoId: parseInt(id),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
