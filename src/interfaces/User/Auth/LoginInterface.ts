export interface LoginInterface {
    findByEmail(email: string): Promise<any>;
    findIdRestaurantByUserId(id: number): Promise<number | null>;
    findEmployeeByEmail(email: string): Promise<any>;
    getCurrency(id: number): Promise<string>;
    findAllSucursalesByRestaurantId(restaurantId: number): Promise<any[]>;
}
