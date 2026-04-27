import { prisma } from "@/libs/prisma";

export class CajaRepository {
    async create(data) {
        return await prisma.caja.create({
            data,
        });
    }

    async update(id, data) {
        return await prisma.caja.update({
            where: { id: parseInt(id) },
            data,
        });
    }

    async delete(id) {
        return await prisma.caja.delete({
            where: { id: parseInt(id) },
        });
    }

    async findById(id) {
        return await prisma.caja.findUnique({
            where: { id: parseInt(id) },
            include: {
                sucursal: true,
                turnos: {
                    include: {
                        empleado: true
                    },
                    orderBy: {
                        fechaApertura: 'desc'
                    },
                    take: 5
                }
            }
        });
    }

    async findByRestaurant(restaurantId) {
        return await prisma.caja.findMany({
            where: { restaurantId: parseInt(restaurantId) },
            include: {
                sucursal: true,
                turnos: {
                    where: { estado: "Abierto" },
                    include: { empleado: true }
                }
            }
        });
    }

    async openShift(data) {
        return await prisma.$transaction(async (tx) => {
            const turno = await tx.turnoCaja.create({
                data: {
                    cajaId: data.cajaId,
                    empleadoId: data.empleadoId,
                    montoApertura: data.montoApertura,
                    estado: "Abierto",
                }
            });
            await tx.caja.update({
                where: { id: data.cajaId },
                data: { estado: "Abierta", balanceActual: data.montoApertura }
            });
            return turno;
        });
    }

    async closeShift(id, data) {
        return await prisma.$transaction(async (tx) => {
            const turno = await tx.turnoCaja.update({
                where: { id: parseInt(id) },
                data: {
                    montoCierre: data.montoCierre,
                    fechaCierre: new Date(),
                    estado: "Cerrado",
                }
            });
            await tx.caja.update({
                where: { id: turno.cajaId },
                data: { estado: "Cerrada", balanceActual: data.montoCierre }
            });
            return turno;
        });
    }
}
