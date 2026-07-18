export interface IPlato {
    findAllByRestaurantId(restaurantId: number): Promise<any[]>;
    findAllByRestaurantIdAndSucursalId(restaurantId: number, sucursalId: number | string): Promise<any[]>;
    findImagesByIds(imageIds: number[]): Promise<any[]>;
}