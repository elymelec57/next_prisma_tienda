export interface IGetIngredient {
    findAllByRestaurantId(restaurantId: number, sucursalId?: number | null): Promise<any[]>;
    findAllByRestaurantAndSucursalId(restaurantId: number, sucursalId: number): Promise<any[]>;
    findById(id: number): Promise<any | null>;
}