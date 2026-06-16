import { NextResponse } from "next/server";
import { FindOrderByIdService } from "@/services/User/Order/FindOrderByIdService";
import { FindOrderByIdRepository } from "@/repositories/User/Order/FindOrderByIdRepository";
import { UpdateOrderStatusService } from "@/services/User/Order/UpdateOrderStatusService";
import { UpdateOrderStatusRepository } from "@/repositories/User/Order/UpdateOrderStatusRepository";
import { UpdateOrderService } from "@/services/User/Order/UpdateOrderService";
import { UpdateOrderRepository } from "@/repositories/User/Order/UpdateOrderRepository";

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const service = new FindOrderByIdService(new FindOrderByIdRepository());
        const order = await service.execute(Number(id));

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    const { id } = await params;
    try {
        const { total, items, nombreCliente, estado, mesaId } = await request.json();

        // Si se envió solo el estado (para el flujo de cocina/mesero), no actualizamos la comanda
        if (estado && !items) {
            const service = new UpdateOrderStatusService(new UpdateOrderStatusRepository());
            const result = await service.execute(Number(id), estado, mesaId ? Number(mesaId) : undefined);
            return NextResponse.json({ status: true, order: result });
        }

        const service = new UpdateOrderService(new UpdateOrderRepository());
        const result = await service.execute(Number(id), { total, items, nombreCliente });
        return NextResponse.json({ status: true, order: result });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ message: 'Error al actualizar el pedido', error: error.message }, { status: 500 });
    }
}
