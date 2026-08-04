export interface IGetEmployeesRepository {
    findRestaurantByUserId(id: number): Promise<any>;
}