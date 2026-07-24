export interface IAllOrderOnline {
    allOrderOnline(id: number): Promise<any>;
    allOrderRestaurantAndSucursals(id: number, sucursalId: number): Promise<any>;
}