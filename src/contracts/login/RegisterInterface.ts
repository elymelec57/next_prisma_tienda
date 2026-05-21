
export interface RegisterInterface {
    create(data: CreateUserParams): Promise<any>;
}

type CreateUserParams = {
    email: string;
    name: string;
    password: string;
}
