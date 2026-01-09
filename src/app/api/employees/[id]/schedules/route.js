// src/app/api/employees/[id]/schedules/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../libs/prisma';
import { authorizeRequest } from '../../../../../../libs/auth';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { authorized, error, status } = await authorizeRequest(request, id, 'employee');

    if (!authorized) {
      return NextResponse.json({ error }, { status });
    }

    const schedules = await prisma.empleadoHorario.findMany({
      where: { empleadoId: parseInt(id) },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { authorized, error, status } = await authorizeRequest(request, id, 'employee');

    if (!authorized) {
      return NextResponse.json({ error }, { status });
    }

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
