import { NextResponse } from 'next/server';
import { authorizeRequest } from '@/libs/auth';
import { DashboardRepository } from '@/repositories/User/Panel/DashboardRepository';
import { DashboardService } from '@/services/User/Panel/DashboardService';

const panelRepo = new DashboardRepository();
const panelService = new DashboardService(panelRepo);

export async function GET(request) {

  const user = await authorizeRequest(request)

  if (!user || !user.authorized) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  try {

    const dashboardData = await panelService.execute(user.auth.id);
    return NextResponse.json({
      restaurant: {
        name: dashboardData.restaurant.name,
        slogan: dashboardData.restaurant.slogan,
        logo: dashboardData.LogoRestaurante,
        currency: dashboardData.restaurant.currency,
      },
      stats: dashboardData.stats,
      platos: dashboardData.restaurant.platos,
      pedidos: dashboardData.restaurant.pedidos,
    });

  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}