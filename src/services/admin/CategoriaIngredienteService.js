export class CategoriaIngredienteService {
    constructor(categoriaIngredienteRepository) { this.categoriaIngredienteRepository = categoriaIngredienteRepository; }
    async getAllCategorias() { return await this.categoriaIngredienteRepository.findAll(); }
    async getCategoriaById(id) { return await this.categoriaIngredienteRepository.findById(id); }
    async createCategoria(data) { return await this.categoriaIngredienteRepository.create(data); }
    async updateCategoria(id, data) { return await this.categoriaIngredienteRepository.update(id, data); }
    async deleteCategoria(id) { return await this.categoriaIngredienteRepository.delete(id); }
}
