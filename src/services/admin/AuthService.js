import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export class AuthService {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    async login(email, password) {
        if (!email || !password) {
            throw new Error('Enter data');
        }

        const auth = await this.authRepository.findByEmail(email);

        if (!auth) {
            throw new Error('User not found ');
        }

        const match = bcrypt.compareSync(password, auth.password);
        if (!match) {
            throw new Error('not match password');
        }

        const data = {
            id: auth.id,
            name: auth.name,
            email: auth.email,
            role: auth.roles[0]?.name
        };

        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: data
        }, process.env.JWT_TOKEN);

        return { auth: data, token };
    }

    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_TOKEN);
            return decoded.data;
        } catch (err) {
            return null;
        }
    }

    async updateAdminProfile(id, form) {
        const admin = await this.authRepository.findById(id);
        if (!admin) {
            throw new Error('Admin not found');
        }

        let updateData = {
            name: form.name,
            email: form.email
        };

        if (form.current_password && form.password && form.confirm_password) {
            const match = bcrypt.compareSync(form.current_password, admin.password);
            if (!match) {
                throw new Error('the password current is incorrect');
            }

            if (form.password !== form.confirm_password) {
                throw new Error('the passwords not match');
            }

            const salt = bcrypt.genSaltSync(10);
            updateData.password = bcrypt.hashSync(form.confirm_password, salt);
        }

        return await this.authRepository.updateProfile(id, updateData);
    }
}
