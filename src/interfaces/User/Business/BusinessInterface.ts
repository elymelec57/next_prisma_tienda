export interface IBusinessRepository {
    getBusinessByUserId(userId: number): Promise<any>;
    getImageById(imageId: string): Promise<any>;
}
