export interface IGetClientsRepository {
    findRestaurantByUserId(id: number): Promise<any>;
}