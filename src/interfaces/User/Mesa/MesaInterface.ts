export interface MesaInterface {
    findAllByRestaurantId(restaurantId: number): Promise<any>;
    findAllByRestaurantIdAndSucursalId(restaurantId: number, sucursalId: number): Promise<any>;
    findRestaurantByUserId(userId: number): Promise<any>;
}