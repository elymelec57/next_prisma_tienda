import { NextResponse } from 'next/server';
import { authorizeRequest } from '@/libs/auth';
import { IngredientRepository } from '@/repositories/User/Ingredient/IngredientRepository';
import { RestaurantRepository } from '@/repositories/RestaurantRepository';
import { IngredientService } from '@/services/User/Ingredient/IngredientService';
import { UpdateIngredientRepository } from '@/repositories/User/Ingredient/UpdateIngredientRepository';
import { UpdateIngredientService } from '@/services/User/Ingredient/UpdateIngredientService';
import { DeleteIngredientRepository } from '@/repositories/User/Ingredient/DeleteIngredientRepository';
import { DeleteIngredientService } from '@/services/User/Ingredient/DeleteIngredientService';

export async function GET(request, segmentData) {
    const user = await authorizeRequest(request);
    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const params = await segmentData.params;
    try {
        const ingredientRepository = new IngredientRepository();
        const restaurantRepository = new RestaurantRepository();
        const ingredientService = new IngredientService(ingredientRepository, restaurantRepository);

        const result = await ingredientService.getIngredientById(params.id);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, segmentData) {
    const user = await authorizeRequest(request);
    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const params = await segmentData.params;
    try {
        const data = await request.json();
        const updateRepository = new UpdateIngredientRepository();
        const updateService = new UpdateIngredientService(updateRepository);

        const result = await updateService.execute(params.id, data);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, segmentData) {
    const user = await authorizeRequest(request);
    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const params = await segmentData.params;
    try {
        const deleteRepository = new DeleteIngredientRepository();
        const deleteService = new DeleteIngredientService(deleteRepository);

        await deleteService.execute(params.id);
        return NextResponse.json({ message: 'Ingredient deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
