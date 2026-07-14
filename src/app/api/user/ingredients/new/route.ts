import { NextResponse } from 'next/server';
import { authorizeRequest } from '@/libs/auth';
import { StoreIngredientRepository } from '@/repositories/User/Ingredient/StoreIngredientRepository';
import { StoreIngredientService } from '@/services/User/Ingredient/StoreIngredientService';

const storeIngredientRepository = new StoreIngredientRepository();
const storeIngredientService = new StoreIngredientService(storeIngredientRepository);

export async function POST(request) {
    const user = await authorizeRequest(request);

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        const data = await request.json();
        const result = await storeIngredientService.execute(data, user.auth.restauranteId);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
