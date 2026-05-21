import { User } from "@prisma/client";

export interface RegisterInterface {
    create(data: CreateUserParams): Promise<User>;
}

type CreateUserParams = {
    email: string;
    name: string;
    password: string;
}
