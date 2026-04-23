export class IngredienteService {
    constructor(ingredienteRepository) {
        this.ingredienteRepository = ingredienteRepository;
    }

    async getAllIngredientes() {
        return await this.ingredienteRepository.findAll();
    }

    async getIngredienteById(id) {
        return await this.ingredienteRepository.findById(id);
    }

    async createIngrediente(data) {
        return await this.ingredienteRepository.create(data);
    }

    async updateIngrediente(id, data) {
        return await this.ingredienteRepository.update(id, data);
    }

    async deleteIngrediente(id) {
        return await this.ingredienteRepository.delete(id);
    }
}
