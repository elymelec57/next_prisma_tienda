import { IUpdateIngredient } from "@/interfaces/User/Ingredient/UpdateIngredientInterface";

export class UpdateIngredientService {
    constructor(
        private updateRepository: IUpdateIngredient
    ) { }

    async execute(id: number, data: any) {
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
