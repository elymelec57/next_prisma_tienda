export class RolUserService {
    constructor(rolUserRepository) {
        this.rolUserRepository = rolUserRepository;
    }

    async getAllRoles() {
        return await this.rolUserRepository.findAll();
    }

    async getRolById(id) {
        return await this.rolUserRepository.findById(id);
    }

    async createRol(data) {
        return await this.rolUserRepository.create(data);
    }

    async updateRol(id, data) {
        return await this.rolUserRepository.update(id, data);
    }

    async deleteRol(id) {
        return await this.rolUserRepository.delete(id);
    }
}
