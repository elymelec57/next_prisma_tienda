import { NextResponse } from 'next/server';
import { AllRestaurantRepository } from '@/repositories/admin/Restaurant/AllRestaurantRepository';
import { RestaurantRepository } from '@/repositories/admin/Restaurant/RestaurantRepository';
import { AllRestaurantService } from '@/services/admin/Restaurant/AllRestaurantService';
import { StoreRestaurantService } from '@/services/admin/Restaurant/StoreRestaurantService';
import { UpdateRestaurantService } from '@/services/admin/Restaurant/UpdateRestaurantService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new RestaurantRepository();

async function checkAdmin(request: any) {
    const admin: any = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function GET(request: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const allRepository = new AllRestaurantRepository();
    const service = new AllRestaurantService(allRepository);
    const restaurantes = await service.execute();
    return NextResponse.json({ status: true, restaurantes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const data = await request.json();
    const service = new StoreRestaurantService(repository);
    await service.execute(data);
    return NextResponse.json({ status: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const data = await request.json();
    const service = new UpdateRestaurantService(repository);
    await service.execute(data.id, data);
    return NextResponse.json({ status: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
