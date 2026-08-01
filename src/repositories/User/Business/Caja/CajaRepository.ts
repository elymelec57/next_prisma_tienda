import { prisma } from "@/libs/prisma";
import {
    ICajaRepository,
    ICreateCajaData,
    IUpdateCajaData,
    IOpenShiftData,
    ICloseShiftData,
    ICaja,
    ITurnoCaja
} from "@/interfaces/User/Business/Caja/ICajaRepository";

export class CajaRepository implements ICajaRepository {
    async create(data: ICreateCajaData): Promise<ICaja> {
        return await prisma.caja.create({ data }) as ICaja;
    }

    async update(id: number | string, data: IUpdateCajaData): Promise<ICaja> {
        return await prisma.caja.update({
            where: { id: parseInt(String(id)) },
            data,
        }) as ICaja;
    }

    async delete(id: number | string): Promise<ICaja> {
        return await prisma.caja.delete({
            where: { id: parseInt(String(id)) },
        }) as ICaja;
    }

    async findById(id: number | string): Promise<ICaja | null> {
        return await prisma.caja.findUnique({
            where: { id: parseInt(String(id)) },
            include: {
                sucursal: true,
                turnos: {
                    include: { empleado: true },
                    orderBy: { fechaApertura: 'desc' },
                    take: 5
                }
            }
        }) as ICaja | null;
    }

    async findByRestaurant(restaurantId: number | string): Promise<ICaja[]> {
        return await prisma.caja.findMany({
            where: { restaurantId: parseInt(String(restaurantId)) },
            include: {
                sucursal: true,
                turnos: {
                    where: { estado: "Abierto" },
                    include: { empleado: true }
                }
            }
        }) as ICaja[];
    }

    async openShift(data: IOpenShiftData): Promise<ITurnoCaja> {
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
        }) as ITurnoCaja;
    }

    async closeShift(id: number | string, data: ICloseShiftData): Promise<ITurnoCaja> {
        return await prisma.$transaction(async (tx) => {
            const turno = await tx.turnoCaja.update({
                where: { id: parseInt(String(id)) },
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
        }) as ITurnoCaja;
    }
}
