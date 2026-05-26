import { prisma } from "@/libs/prisma";
import { IAuth } from "@/interfaces/admin/Auth/AuthInterface";

export class AuthRepository implements IAuth {
    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                roles: {
                    select: {
                        name: true
                    },
                },
            },
        });
    }

    async findById(id: number) {
        return await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            },
        });
    }

    async updateProfile(id: number, data: any) {
        return await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: data,
        });
    }
}
