import bcrypt from 'bcryptjs';
import { registerSchema } from "@/app/schemas/registerSchema";
import { RegisterInterface, CreateUserParams } from '@/contracts/login/RegisterInterface';

export class RegisterService {
    constructor(private registerRepository: RegisterInterface) {
    }

    async execute(data: CreateUserParams) {
        const parsed = registerSchema.safeParse(data);
        if (!parsed.success) {
            throw new Error(parsed.error?.message);
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(data.confirm_password, salt);

        const user = await this.registerRepository.create({
            email: data.email,
            name: data.name,
            password: hash,
            confirm_password: hash
        });

        if (!user || !user.id) {
            throw new Error('Error creating User');
        }

        return user;
    }
}
