import { RegisterInterface, CreateUserParams } from '@/interfaces/User/Auth/RegisterInterface';
import { prisma } from '@/libs/prisma';

export class RegisterRepository implements RegisterInterface {

    async create(data: CreateUserParams) {
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
}