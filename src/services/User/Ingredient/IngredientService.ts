import { IGetIngredient } from "@/interfaces/User/Ingredient/GetIngredientInterface";

export class IngredientService {
    constructor(private ingredientRepository: IGetIngredient) { }

    async getIngredientsByRestaurant(restaurantId: number, sucursalId?: number | null) {
        const currency = await this.ingredientRepository.getCurrency(restaurantId);
        const ingredients = await this.ingredientRepository.findAllByRestaurantId(restaurantId, sucursalId);

        const serialized = ingredients.map(ing => ({
            ...ing,
            costoUnitario: Number(ing.costoUnitario),
            stockActual: Number(ing.stockActual),
            stockMinimo: Number(ing.stockMinimo),
            stockMaximo: ing.stockMaximo ? Number(ing.stockMaximo) : null,
        }));

        return { ingredients: serialized, currency };
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
