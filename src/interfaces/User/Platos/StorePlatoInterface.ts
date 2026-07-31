export interface IStorePlato {
    RestaurantByUserId(userId: number): Promise<any>;
    create(data: any): Promise<any>;
    createImage(data: any): Promise<any>;
    updateImage(id: string, modelId: string): Promise<any>;
}