import bcrypt from 'bcryptjs';
import { IUser, User } from "@/interfaces/admin/User/UserInterface";

export class UpdateUserService {
    constructor(
        private updateUser: IUser
    ) {
    }

    async execute(id: number, data: User) {
        const updateData = {
            email: data.email,
            name: data.name,
            password: ''
        };

        if (data.password) {
            const salt = bcrypt.genSaltSync(10);
            updateData.password = bcrypt.hashSync(data.password, salt);
        }
        return await this.updateUser.update(id, updateData)
    }
}