
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

    const employee = await prisma.empleado.findUnique({
      where: { id: parseInt(id), restaurantId },
      include: { rol: true, shifts: true }
    });

    if (!employee) return NextResponse.json({ error: 'Employee not found' }, { status: 404 })

    return NextResponse.json(employee);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const restaurantId = await getRestaurantId()
    if (!restaurantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { nombre, apellido, telefono, rolId, userId: employeeUserId } = await request.json();

    const updatedEmployee = await prisma.empleado.update({
      where: { id: parseInt(id), restaurantId },
      data: {
        nombre,
        apellido,
        telefono,
        rolId,
        userId: employeeUserId,
      },
      include: { rol: true }
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const restaurantId = await getRestaurantId()
    if (!restaurantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.empleado.delete({
      where: { id: parseInt(id), restaurantId },
    });

    return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
