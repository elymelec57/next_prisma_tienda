import { prisma } from "@/libs/prisma";
import { IAllUserInterface } from "@/interfaces/admin/User/AllUserInterface";

export class AllUserRepository implements IAllUserInterface {
    async allUsers(): Promise<any[]> {
        return await prisma.user.findMany({
            where: {
                roles: {
                    some: { name: 'User' }
                }
            },
        });
    }
    async roleUsers(): Promise<any[]> {
        return await prisma.rolUser.findMany();
    }
}