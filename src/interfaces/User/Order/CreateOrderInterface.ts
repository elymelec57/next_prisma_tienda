export interface CreateOrderItemData {
    platoId: number;
    cantidad: number;
    precioUnitario: number;
    nota?: string;
}

export interface CreateOrderData {
    restaurantId: number;
    sucursalId?: number | null;
    clienteId?: number | null;
    nombreCliente?: string | null;
    total: number;
    estado?: string;
    mesaId: number;
    empleadoId?: number | null;
    idpotencia?: string | null;
    items: CreateOrderItemData[];
}

export interface ICreateOrder {
    createOrder(data: CreateOrderData): Promise<any>;
}
