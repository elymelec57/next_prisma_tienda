import { RegisterInterface, CreateUserParams } from '@/contracts/login/RegisterInterface';
import { prisma } from '@/libs/prisma';

export class RegisterRepository implements RegisterInterface {

    async create(data: CreateUserParams) {
        return await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
                roles: {
                    connect: { id: data.roleId || 2 }
                },
            },
        });
    }
}