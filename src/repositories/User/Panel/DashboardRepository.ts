import { IDashboardUserInterface } from "@/interfaces/User/Panel/DashboardInterface";
import { prisma } from '@/libs/prisma';


export class DashboardRepository implements IDashboardUserInterface {

    async dashboardUser(id) {
        let LogoRestaurante = '';
        const restaurant = await prisma.restaurant.findUnique({
            where: {
                userId: id,
            },
            include: {
                platos: true,
                pedidos: {
                    include: {
                        items: true,
                    },
                },
                cliente: true,
            },
        });

        if (restaurant.mainImageId != null) {
            const image = await prisma.image.findUnique({
                where: {
                    id: restaurant.mainImageId
                },
                select: {
                    id: true,
                    url: true
                }
            });
            LogoRestaurante = image.url
        } else {
            LogoRestaurante = null
        }

        const totalPlatos = restaurant.platos.length;
        const totalPedidos = restaurant.pedidos.length;
        const pedidosPendientes = restaurant.pedidos.filter(p => p.estado === 'Pendiente').length;
        const ingresosTotales = restaurant.pedidos.reduce((sum, p) => sum + p.total, 0);
        const totalClientes = restaurant.cliente.length;

        return {
            restaurant,
            stats: {
                totalPlatos,
                totalPedidos,
                pedidosPendientes,
                ingresosTotales,
                totalClientes,
            },
            LogoRestaurante
        };
    }
}