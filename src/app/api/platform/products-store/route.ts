import { NextResponse } from 'next/server';
import { ProductsData } from '@/libs/ProductsData';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const categoryId = searchParams.get('categoryId');
    const sucursalId = searchParams.get('sucursalId');
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '6');

    if (!id) {
        return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 });
    }

    try {
        const products = await ProductsData({ id, categoryId, sucursalId, skip, take });
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
