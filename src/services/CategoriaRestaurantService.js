export class CategoriaRestaurantService {
    constructor(categoriaRestaurantRepository) {
        this.categoriaRestaurantRepository = categoriaRestaurantRepository;
    }

    async getAllCategorias() {
        return await this.categoriaRestaurantRepository.findAll();
    }

    async getCategoriaById(id) {
        return await this.categoriaRestaurantRepository.findById(id);
    }

    async createCategoria(data) {
        return await this.categoriaRestaurantRepository.create({
            nombre: data.name
        });
    }

    async updateCategoria(id, data) {
        return await this.categoriaRestaurantRepository.update(id, {
            nombre: data.name
        });
    }

    async deleteCategoria(id) {
        return await this.categoriaRestaurantRepository.delete(id);
    }
}
