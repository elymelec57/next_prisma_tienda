export class EmployeeService {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    async getEmployeesByRestaurant(restaurantId) {
        return await this.employeeRepository.findAllByRestaurantId(restaurantId);
    }
}
