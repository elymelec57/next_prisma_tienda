import { prisma } from "@/libs/prisma";
import { IRol, Rol } from "@/interfaces/admin/Rol/RolInterface";

export class RolRepository implements IRol {
    async create(data: Rol) {
        return await prisma.rol.create({
            data: {
                name: data.name
            }
        });
    }

    async update(id: number, data: Rol) {
        return await prisma.rol.update({
            where: { id: Number(id) },
            data: {
                name: data.name
            }
        });
    }

    async delete(id: number) {
        return await prisma.rol.delete({
            where: { id: Number(id) }
        });
    }

    async findById(id: number) {
        return await prisma.rol.findUnique({
            where: { id: Number(id) }
        });
    }
}
