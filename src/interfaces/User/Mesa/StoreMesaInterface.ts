export interface StoreMesaInterface {
    findRestaurantByUserId(userId: number): Promise<any>;
    create(data: any): Promise<any>;
}