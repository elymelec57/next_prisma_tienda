
export interface RegisterInterface {
    create(data: CreateUserParams): Promise<any>;
}

export type CreateUserParams = {
    email: string;
    name: string;
    password: string;
    confirm_password: string;
}
