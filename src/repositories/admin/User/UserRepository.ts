import { prisma } from "@/libs/prisma";
import { IUser, User } from "@/interfaces/admin/User/UserInterface";

export class UserRepository implements IUser {

    async create(data: User) {

        return await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
                roles: {
                    connect: { id: 2 }
                },
            },
        });

    }

    async update(id: number, data: User) {
        return await prisma.user.update({
            where: { id: Number(id) },
            data: data
        });
    }

    async delete(id: number) {
        return await prisma.user.delete({
            where: { id: Number(id) }
        });
    }

}