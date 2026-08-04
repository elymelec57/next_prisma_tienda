export interface MesaInterface {
    findAllByRestaurantId(restaurantId: number): Promise<any>;
    findRestaurantByUserId(userId: number): Promise<any>;
}