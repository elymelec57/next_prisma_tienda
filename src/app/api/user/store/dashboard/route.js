import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma'; // Make sure this path is correct
import verifyToken from '@/libs/fecthVerifyToken'; // Make sure this path is correct

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const origin = request.nextUrl.origin

    if (!token) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    const user = await verifyToken(origin, token);

    if (!user) {
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        userId: user.auth.id,
      },
      include: {
        platos: true,
        pedidos: {
          include: {
            items: true,
          },
        },
        cliente: true,
      },
    });

    if (restaurant.mainImageId != null) {
      const image = await prisma.image.findUnique({
        where: {
          id: restaurant.mainImageId
        },
        select: {
          id: true,
          url: true
        }
      });
      restaurant.url = image.url
    } else {
      restaurant.url = null
    }

    if (!restaurant) {
      return NextResponse.json({ message: 'Restaurante no encontrado para el usuario' }, { status: 404 });
    }

    // Calcular estadísticas del dashboard
    const totalPlatos = restaurant.platos.length;
    const totalPedidos = restaurant.pedidos.length;
    const pedidosPendientes = restaurant.pedidos.filter(p => p.estado === 'Pendiente').length;
    const ingresosTotales = restaurant.pedidos.reduce((sum, p) => sum + p.total, 0);
    const totalClientes = restaurant.cliente.length;

    return NextResponse.json({
      restaurant: {
        name: restaurant.name,
        slogan: restaurant.slogan,
        logo: restaurant.url,
      },
      stats: {
        totalPlatos,
        totalPedidos,
        pedidosPendientes,
        ingresosTotales,
        totalClientes,
      },
      platos: restaurant.platos,
      pedidos: restaurant.pedidos,
    });

  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}