import { IGetEmployeesRepository } from "@/interfaces/User/Employees/GetEmployeesInterface";

export class EmployeeService {
    constructor(private employeeRepository: IGetEmployeesRepository) {
    }

    async getEmployeesByRestaurant(restaurantId: number) {
        return await this.employeeRepository.findRestaurantByUserId(restaurantId);
    }
}
