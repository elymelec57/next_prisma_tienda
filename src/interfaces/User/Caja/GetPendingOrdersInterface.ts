export interface IGetPendingOrders {
    getPendingOrders(restaurantId: number): Promise<any[]>;
}
