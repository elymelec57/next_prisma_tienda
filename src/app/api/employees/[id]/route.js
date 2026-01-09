// src/app/api/employees/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../libs/prisma';
import { authorizeRequest } from '../../../../../libs/auth';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { authorized, error, status, employee } = await authorizeRequest(request, id, 'employee');

    if (!authorized) {
      return NextResponse.json({ error }, { status });
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { authorized, error, status } = await authorizeRequest(request, id, 'employee');

    if (!authorized) {
      return NextResponse.json({ error }, { status });
    }

    const { nombre, apellido, telefono, rolId, userId: employeeUserId } = await request.json();

    const updatedEmployee = await prisma.empleado.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        apellido,
        telefono,
        rolId,
        userId: employeeUserId,
      },
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { authorized, error, status } = await authorizeRequest(request, id, 'employee');

    if (!authorized) {
      return NextResponse.json({ error }, { status });
    }

    await prisma.empleado.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
