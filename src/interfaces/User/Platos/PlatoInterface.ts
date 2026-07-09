export interface IPlato {
    findAllByRestaurantId(restaurantId: number): Promise<any[]>;
    findImagesByIds(imageIds: number[]): Promise<any[]>;
}