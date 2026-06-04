import bcrypt from 'bcryptjs';

export class StoreEmployeeService {
    constructor(storeEmployeeRepository) {
        this.storeEmployeeRepository = storeEmployeeRepository;
    }

    async execute(data, userId, restaurantId) {
        const hashedPassword = bcrypt.hashSync(data.password, 10);
        return await this.storeEmployeeRepository.create({
            ...data,
            password: hashedPassword,
            userId: userId,
            restaurantId: restaurantId
        });
    }
}
