export class CategoriaService {
    constructor(categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    async getAllCategorias() {
        return await this.categoriaRepository.findAll();
    }

    async getCategoriaById(id) {
        return await this.categoriaRepository.findById(id);
    }

    async createCategoria(data) {
        return await this.categoriaRepository.create({
            nombre: data.name
        });
    }

    async updateCategoria(id, data) {
        return await this.categoriaRepository.update(id, {
            nombre: data.name
        });
    }

    async deleteCategoria(id) {
        return await this.categoriaRepository.delete(id);
    }
}
