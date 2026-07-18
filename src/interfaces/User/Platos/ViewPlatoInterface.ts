export interface IViewPlato {
    AllContornos(restaurantId: number): Promise<any[]>;
    AllContornosSucursalId(restaurantId: number, sucursalId: number | string): Promise<any[]>;
    findCategoriesByRestaurantId(restaurantId: number): Promise<any[]>;
}