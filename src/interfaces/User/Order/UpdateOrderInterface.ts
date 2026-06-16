export interface UpdateOrderData {
    total: number;
    items: {
        platoId: number;
        cantidad: number;
        precioUnitario: number;
        nota?: string;
    }[];
    nombreCliente?: string;
}

export interface IUpdateOrder {
    updateOrder(id: number, data: UpdateOrderData): Promise<any>;
}
