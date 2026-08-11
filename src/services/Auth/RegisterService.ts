import bcrypt from 'bcryptjs';
import { registerSchema } from "@/app/schemas/registerSchema";
import { RegisterInterface, CreateUserParams } from '@/interfaces/User/Auth/RegisterInterface';

export class RegisterService {
    constructor(private registerRepository: RegisterInterface) {
    }

    async execute(data: CreateUserParams) {
        const parsed = registerSchema.safeParse(data);
        if (!parsed.success) {
            return { 'status': false, 'message': parsed.error?.issues[0]?.message, user: null };
        }

        const existingUser = await this.registerRepository.exist(data.email);
        if (existingUser) {
            return { 'status': false, 'message': 'El email ya está registrado', user: null };
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(data.confirm_password, salt);

        const user = await this.registerRepository.create({
            email: data.email,
            name: data.name,
            password: hash,
            confirm_password: hash
        });

        return { 'status': true, 'message': 'Usuario creado exitosamente', user: user };
    }
}
