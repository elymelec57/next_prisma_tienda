export class CategoriaRestaurantService {
    constructor(categoriaRestaurantRepository) { this.categoriaRestaurantRepository = categoriaRestaurantRepository; }
    async getAllCategorias() { return await this.categoriaRestaurantRepository.findAll(); }
    async getCategoriaById(id) { return await this.categoriaRestaurantRepository.findById(id); }
    async createCategoria(data) { return await this.categoriaRestaurantRepository.create(data); }
    async updateCategoria(id, data) { return await this.categoriaRestaurantRepository.update(id, data); }
    async deleteCategoria(id) { return await this.categoriaRestaurantRepository.delete(id); }
}
