import { NextResponse } from 'next/server';
import { RestaurantRepository } from '@/repositories/RestaurantRepository';
import { RestaurantService } from '@/services/RestaurantService';
import { authorizeRequest } from '@/libs/auth';

const restaurantRepository = new RestaurantRepository();
const restaurantService = new RestaurantService(restaurantRepository);

async function checkAdmin(request) {
    const user = await authorizeRequest(request);
    if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
        return false;
    }
    return true;
}

export async function GET(request, { params }) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const { id } = await params;
    const restaurante = await restaurantService.getRestaurantById(id);
    if (!restaurante) {
      return NextResponse.json({ error: 'Restaurante no encontrado' }, { status: 404 });
    }
    return NextResponse.json(restaurante);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const { id } = await params;
    await restaurantService.deleteRestaurant(id);
    return NextResponse.json({ status: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
