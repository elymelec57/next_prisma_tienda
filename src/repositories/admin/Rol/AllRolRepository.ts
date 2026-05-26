import { prisma } from "@/libs/prisma";
import { IAllRol } from "@/interfaces/admin/Rol/RolInterface";

export class AllRolRepository implements IAllRol {
    async all(): Promise<any[]> {
        return await prisma.rol.findMany();
    }
}
