import { NextResponse } from 'next/server';
import { RestaurantRepository } from '@/repositories/admin/Restaurant/RestaurantRepository';
import { GetRestaurantService } from '@/services/admin/Restaurant/GetRestaurantService';
import { DeleteRestaurantService } from '@/services/admin/Restaurant/DeleteRestaurantService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new RestaurantRepository();

async function checkAdmin(request: any) {
    const admin: any = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function GET(request: any, { params }: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const { id } = await params;
    const service = new GetRestaurantService(repository);
    const restaurante = await service.execute(id);
    if (!restaurante) {
      return NextResponse.json({ error: 'Restaurante no encontrado' }, { status: 404 });
    }
    return NextResponse.json(restaurante);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: any, { params }: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const { id } = await params;
    const service = new DeleteRestaurantService(repository);
    await service.execute(id);
    return NextResponse.json({ status: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
