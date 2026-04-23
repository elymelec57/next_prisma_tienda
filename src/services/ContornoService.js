export class ContornoService {
    constructor(contornoRepository) {
        this.contornoRepository = contornoRepository;
    }

    async getAllContornos() {
        return await this.contornoRepository.findAll();
    }

    async getContornoById(id) {
        return await this.contornoRepository.findById(id);
    }

    async createContorno(data) {
        return await this.contornoRepository.create(data);
    }

    async updateContorno(id, data) {
        return await this.contornoRepository.update(id, data);
    }

    async deleteContorno(id) {
        return await this.contornoRepository.delete(id);
    }
}
