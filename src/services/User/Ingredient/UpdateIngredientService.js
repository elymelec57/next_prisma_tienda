export class UpdateIngredientService {
    constructor(updateRepository) {
        this.updateRepository = updateRepository;
    }

    async execute(id, data) {
        const ingredient = await this.updateRepository.update(id, {
            nombre: data.nombre,
            categoria: data.categoria,
            sku: data.sku,
            unidadMedida: data.unidadMedida,
            costoUnitario: data.costoUnitario,
            stockActual: data.stockActual,
            stockMinimo: data.stockMinimo,
            stockMaximo: data.stockMaximo,
            fechaVencimiento: data.fechaVencimiento,
        });

        if (!ingredient) {
            throw new Error('Error al actualizar el ingrediente');
        }

        return ingredient;
    }
}
