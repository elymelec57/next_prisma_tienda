import { IGetEmployeesRepository } from "@/interfaces/User/Employees/GetEmployeesInterface";

export class EmployeeService {
    constructor(private employeeRepository: IGetEmployeesRepository) {
    }

    async getEmployeesByRestaurant(restaurantId: number, sucursalId: number | string) {
        const roles = await this.employeeRepository.getAllRoles();
        const employees = await this.employeeRepository.findRestaurantByUserId(restaurantId, sucursalId);
        return { roles, employees };
    }
}
