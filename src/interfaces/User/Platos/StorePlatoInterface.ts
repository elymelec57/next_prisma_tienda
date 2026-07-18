export interface IStorePlato {
    RestaurantByUserId(userId: number): Promise<any>;
    create(data: any): Promise<any>;
}