export class DeleteIngredientService {
    constructor(deleteRepository) {
        this.deleteRepository = deleteRepository;
    }

    async execute(id) {
        const ingredient = await this.deleteRepository.delete(id);
        if (!ingredient) {
            throw new Error('Error al eliminar el ingrediente');
        }
        return ingredient;
    }
}
