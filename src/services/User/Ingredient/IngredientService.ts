import { IGetIngredient } from "@/interfaces/User/Ingredient/GetIngredientInterface";

export class IngredientService {
    constructor(private ingredientRepository: IGetIngredient) { }

    async getIngredientsByRestaurant(restaurantId: number, sucursalId?: number | string) {
        let ingredients;
        if (sucursalId == 'main') {
            ingredients = await this.ingredientRepository.findAllByRestaurantId(restaurantId, null);
        } else {
            ingredients = await this.ingredientRepository.findAllByRestaurantAndSucursalId(restaurantId, Number(sucursalId));
        }

        const serialized = ingredients.map(ing => ({
            ...ing,
            costoUnitario: Number(ing.costoUnitario),
            stockActual: Number(ing.stockActual),
            stockMinimo: Number(ing.stockMinimo),
            stockMaximo: ing.stockMaximo ? Number(ing.stockMaximo) : null,
        }));

        return { ingredients: serialized };
    }

    async getIngredientById(id) {
        const ingredient = await this.ingredientRepository.findById(id);
        if (!ingredient) {
            throw new Error('Ingrediente no encontrado');
        }

        const serialized = {
            ...ingredient,
            costoUnitario: Number(ingredient.costoUnitario),
            stockActual: Number(ingredient.stockActual),
            stockMinimo: Number(ingredient.stockMinimo),
            stockMaximo: ingredient.stockMaximo ? Number(ingredient.stockMaximo) : null,
        };

        return serialized;
    }
}
