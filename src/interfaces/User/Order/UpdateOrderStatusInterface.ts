export interface IUpdateOrderStatus {
    updateOrderStatus(id: number, estado: string, mesaId?: number): Promise<any>;
}
