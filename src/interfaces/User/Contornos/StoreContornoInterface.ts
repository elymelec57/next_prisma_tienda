export interface IStoreContorno {
    RestaurantByUserId(userId: number): Promise<any>;
    create(data: any): Promise<any>;
    createContornoSucursal(data: any): Promise<any>;
}