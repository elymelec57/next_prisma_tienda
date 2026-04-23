export class RolService {
    constructor(rolRepository) {
        this.rolRepository = rolRepository;
    }

    async getAllRoles() {
        return await this.rolRepository.findAll();
    }

    async getRolById(id) {
        return await this.rolRepository.findById(id);
    }

    async createRol(data) {
        return await this.rolRepository.create(data);
    }

    async updateRol(id, data) {
        return await this.rolRepository.update(id, data);
    }

    async deleteRol(id) {
        return await this.rolRepository.delete(id);
    }
}
