import { IStoreIngredient } from "@/interfaces/User/Ingredient/StoreIngredientInterface";

export class StoreIngredientService {
    constructor(
        private storeRepository: IStoreIngredient
    ) { }

    async execute(data: any, restaurantId: number) {
        console.log(restaurantId);
        const ingredient = await this.storeRepository.create({
            nombre: data.nombre,
            categoria: data.categoria,
            sku: data.sku,
            unidadMedida: data.unidadMedida,
            restaurantId: restaurantId,
            costoUnitario: data.costoUnitario,
            stockActual: data.stockActual,
            stockMinimo: data.stockMinimo,
            stockMaximo: data.stockMaximo,
            fechaVencimiento: data.fechaVencimiento,
            sucursalId: data.sucursalId,
        });

        if (!ingredient) {
            throw new Error('Ocurrió un error inesperado');
        }

        return ingredient;
    }
}
