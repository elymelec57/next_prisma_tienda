export interface IBuy {
    transaction<T>(fn: (tx: any) => Promise<T>): Promise<T>;
    findRestaurantBySlug(slug: string, tx: any): Promise<any>;
    findPedidoByIdPotencia(idpotencia: string, restaurantId: number, tx: any): Promise<any>;
    findClient(conditions: any, tx: any): Promise<any>;
    createClient(data: any, tx: any): Promise<any>;
    updateClient(id: number, data: any, tx: any): Promise<any>;
    createPedido(data: any, tx: any): Promise<any>;
    createImage(input: any, tx: any): Promise<any>;
    updateImage(id: string, modelId: string, tx: any): Promise<any>;
    createPayment(data: any, tx: any): Promise<any>;
    createItemPedido(data: any, tx: any): Promise<any>;
}