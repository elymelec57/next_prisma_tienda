export interface IBuy {
    findRestaurantBySlug(slug: string): Promise<any>;
    findClient(conditions: any): Promise<any>;
    createClient(data: any): Promise<any>;
    updateClient(id: number, data: any): Promise<any>;
    createPedido(data: any): Promise<any>;
    createImage(input: any): Promise<any>;
    updateImage(id: string, modelId: string): Promise<any>;
    createPayment(data: any): Promise<any>;
    createItemPedido(data: any): Promise<any>;
}