import { NextResponse } from 'next/server';
import { AllCategoriaRestaurantRepository } from '@/repositories/admin/CategoriaRestaurant/AllCategoriaRestaurantRepository';
import { CategoriaRestaurantRepository } from '@/repositories/admin/CategoriaRestaurant/CategoriaRestaurantRepository';
import { AllCategoriaRestaurantService } from '@/services/admin/CategoriaRestaurant/AllCategoriaRestaurantService';
import { StoreCategoriaRestaurantService } from '@/services/admin/CategoriaRestaurant/StoreCategoriaRestaurantService';
import { UpdateCategoriaRestaurantService } from '@/services/admin/CategoriaRestaurant/UpdateCategoriaRestaurantService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new CategoriaRestaurantRepository();

async function checkAdmin(request: any) {
    const admin: any = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function GET(request: any) {
    // Keep it commented as in original? No, let's keep it consistent.
    // Actually the original had it commented out for GET.
    // Wait, the original was:
    // export async function GET(request) {
    //   // if (!await checkAdmin(request)) {
    //   //   return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    //   // }
    // ...
    // I should follow the original logic unless it's clearly a bug.
    try {
        const allRepository = new AllCategoriaRestaurantRepository();
        const service = new AllCategoriaRestaurantService(allRepository);
        const categorias = await service.execute();
        return NextResponse.json({ status: true, categorias });
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
        const service = new StoreCategoriaRestaurantService(repository);
        await service.execute({ nombre: data.name });
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
        const service = new UpdateCategoriaRestaurantService(repository);
        await service.execute(data.id, { nombre: data.name });
        return NextResponse.json({ status: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
