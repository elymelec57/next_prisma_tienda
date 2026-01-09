// src/libs/auth.js
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

export async function authorizeRequest(request, resourceId, resourceType) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return { authorized: false, error: 'Unauthorized', status: 401 };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const userId = decoded.data.id;

    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
    });

    if (!restaurant) {
      return { authorized: false, error: 'Restaurant not found', status: 404 };
    }

    if (resourceId && resourceType) {
      let resource;
      if (resourceType === 'employee') {
        resource = await prisma.empleado.findUnique({
          where: { id: parseInt(resourceId) },
        });
      } else if (resourceType === 'schedule') {
        const schedule = await prisma.empleadoHorario.findUnique({
          where: { id: resourceId },
          include: { empleado: true },
        });
        if (schedule) {
          resource = { restaurantId: schedule.empleado.restaurantId };
        }
      }

      if (!resource || resource.restaurantId !== restaurant.id) {
        return { authorized: false, error: `${resourceType} not found or not part of your restaurant`, status: 404 };
      }
    }

    return { authorized: true, restaurant };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return { authorized: false, error: 'Unauthorized', status: 401 };
    }
    throw error;
  }
}
