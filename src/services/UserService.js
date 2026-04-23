import bcrypt from 'bcryptjs';

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getAllUsers() {
        return await this.userRepository.findAll();
    }

    async getUserById(id) {
        return await this.userRepository.findById(id);
    }

    async createUser(data) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(data.password, salt);

        return await this.userRepository.create({
            email: data.email,
            name: data.name,
            password: hash,
            roleId: data.roleId
        });
    }

    async updateUser(id, data) {
        const updateData = {
            email: data.email,
            name: data.name,
        };

        if (data.password) {
            const salt = bcrypt.genSaltSync(10);
            updateData.password = bcrypt.hashSync(data.password, salt);
        }

        return await this.userRepository.update(id, updateData);
    }

    async deleteUser(id) {
        return await this.userRepository.delete(id);
    }
}
