import bcrypt from 'bcryptjs';
import { IStoreEmployeeRepository, IDataEmployee } from '@/interfaces/User/Employees/StoreEmployeesInterface';

export class StoreEmployeeService {
    constructor(private storeEmployeeRepository: IStoreEmployeeRepository) { }

    async execute(data: IDataEmployee, userId: number, restaurantId: number) {
        const hashedPassword = bcrypt.hashSync(data.password, 10);
        return await this.storeEmployeeRepository.create({
            ...data,
            password: hashedPassword,
            userId: userId,
            restaurantId: restaurantId
        });
    }
}
