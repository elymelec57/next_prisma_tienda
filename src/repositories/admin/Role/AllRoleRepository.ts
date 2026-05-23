import { prisma } from "@/libs/prisma";
import { IAllRoleInterface } from "@/interfaces/admin/Role/AllRoleInterface";

export class AllRoleRepository implements IAllRoleInterface {
    async allRoles() {
        return await prisma.rolUser.findMany();
    }
}
