export interface IUpdateBusiness {
    updateBusiness(userId: number, data: any, slug: string): Promise<any>;
    createImage(data: any): Promise<any>;
    updateBusinessImage(restaurantId: number, imageId: string): Promise<any>;
    deleteImage(imageId: string): Promise<any>;
}
