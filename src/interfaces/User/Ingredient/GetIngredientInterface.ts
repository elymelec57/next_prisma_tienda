export interface IGetIngredient {
    findAllByRestaurantId(restaurantId: number, sucursalId?: number | null): Promise<any[]>;
    findById(id: number): Promise<any | null>;
    getCurrency(restaurantId: number): Promise<string>;
}