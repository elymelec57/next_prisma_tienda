import { IDeleteIngredient } from "@/interfaces/User/Ingredient/DeleteIngredientInterface";

export class DeleteIngredientService {
    constructor(
        private deleteRepository: IDeleteIngredient
    ) { }

    async execute(id: number) {
        const ingredient = await this.deleteRepository.delete(id);
        if (!ingredient) {
            throw new Error('Error al eliminar el ingrediente');
        }
        return ingredient;
    }
}
