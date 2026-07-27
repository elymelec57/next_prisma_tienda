export interface IBuy {
    findRestaurantBySlug(slug: string): Promise<any>;
    findClient(conditions: any): Promise<any>;
    createClient(data: any): Promise<any>;
    updateClient(id: number, data: any): Promise<any>;
    createPedido(data: any): Promise<any>;
    createPayment(data: any): Promise<any>;
    createItemPedido(data: any): Promise<any>;
}