export class CategoriaIngredienteService {
    constructor(categoriaIngredienteRepository) {
        this.categoriaIngredienteRepository = categoriaIngredienteRepository;
    }

    async getAllCategorias() {
        return await this.categoriaIngredienteRepository.findAll();
    }

    async getCategoriaById(id) {
        return await this.categoriaIngredienteRepository.findById(id);
    }

    async createCategoria(data) {
        return await this.categoriaIngredienteRepository.create({
            nombre: data.name
        });
    }

    async updateCategoria(id, data) {
        return await this.categoriaIngredienteRepository.update(id, {
            nombre: data.name
        });
    }

    async deleteCategoria(id) {
        return await this.categoriaIngredienteRepository.delete(id);
    }
}
