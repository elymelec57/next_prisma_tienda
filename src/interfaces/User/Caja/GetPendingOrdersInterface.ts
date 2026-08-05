export interface IGetPendingOrders {
    getPendingOrders(restaurantId: number, sucursalId: number | string): Promise<any[]>;
}
