export interface IGetEmployeesRepository {
    findRestaurantByUserId(id: number, sucursalId: number | string): Promise<any>;
    getAllRoles(): Promise<any>;
}