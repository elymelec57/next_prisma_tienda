import { NextResponse } from 'next/server';
import { authorizeRequest } from '@/libs/auth';
import { IngredientRepository } from '@/repositories/User/Ingredient/IngredientRepository';
import { RestaurantRepository } from '@/repositories/RestaurantRepository';
import { IngredientService } from '@/services/User/Ingredient/IngredientService';

const ingredientRepository = new IngredientRepository();
const restaurantRepository = new RestaurantRepository();
const ingredientService = new IngredientService(ingredientRepository, restaurantRepository);

export async function GET(request) {
    const user = await authorizeRequest(request);

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const sucursalId = searchParams.get('sucursalId');

        const result = await ingredientService.getIngredientsByRestaurant(
            user.auth.restauranteId,
            sucursalId
        );
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
