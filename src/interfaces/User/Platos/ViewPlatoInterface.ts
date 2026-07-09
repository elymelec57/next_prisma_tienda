export interface IViewPlato {
    getCurrency(restaurantId: number): Promise<string>;
    AllContornos(restaurantId: number): Promise<any[]>;
    Allsucursales(restaurantId: number): Promise<any[]>;
    findCategoriesByRestaurantId(restaurantId: number): Promise<any[]>;
}