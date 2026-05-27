export interface LoginInterface {
    findByEmail(email: string): Promise<any>;
    findIdRestaurantByUserId(id: number): Promise<number | null>;
    findEmployeeByEmail(email: string): Promise<any>;
}
