import { NextResponse } from 'next/server';
import { RestaurantRepository } from '@/repositories/admin/RestaurantRepository';
import { RestaurantService } from '@/services/admin/RestaurantService';
import { authorizeAdmin } from '@/libs/authAdmin';

const restaurantRepository = new RestaurantRepository();
const restaurantService = new RestaurantService(restaurantRepository);

async function checkAdmin(request) {
    const admin = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function GET(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const restaurantes = await restaurantService.getAllRestaurants();
    return NextResponse.json({ status: true, restaurantes });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const data = await request.json();
    await restaurantService.createRestaurant(data);
    return NextResponse.json({ status: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const data = await request.json();
    await restaurantService.updateRestaurant(data.id, data);
    return NextResponse.json({ status: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
