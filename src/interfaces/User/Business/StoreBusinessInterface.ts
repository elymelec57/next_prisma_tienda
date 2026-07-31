export interface IStoreBusiness {
    createBusiness(data: any, slug: string, userId: number, imageId: string): Promise<any>;
    createImage(data: any): Promise<any>;
    updateImage(id: string, modelId: string): Promise<any>;
    updateBusinessImage(id: number, imageId: string): Promise<any>;
}
