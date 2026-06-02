export class StoreIngredientService {
    constructor(storeRepository) {
        this.storeRepository = storeRepository;
    }

    async execute(data, restaurantId) {
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
