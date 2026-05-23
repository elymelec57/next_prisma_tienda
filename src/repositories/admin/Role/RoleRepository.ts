import { prisma } from "@/libs/prisma";
import { IRole, Role } from "@/interfaces/admin/Role/RoleInterface";

export class RoleRepository implements IRole {

    async create(data: Role) {
        return await prisma.rolUser.create({
            data: {
                name: data.name
            }
        });
    }

    async update(id: number, data: Role) {
        return await prisma.rolUser.update({
            where: { id: Number(id) },
            data: {
                name: data.name
            }
        });
    }

    async delete(id: number) {
        return await prisma.rolUser.delete({
            where: { id: Number(id) }
        });
    }
}
