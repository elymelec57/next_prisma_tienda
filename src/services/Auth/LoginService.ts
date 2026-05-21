import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { loginSchema } from "@/app/schemas/authSchema";
import { LoginInterface } from "@/contracts/login/LoginInterface";

export class LoginService {
    constructor(private loginRepository: LoginInterface) { }

    async execute(email: string, password: string) {
        const parsed = loginSchema.safeParse({ email, password });
        if (!parsed.success) {
            throw new Error(parsed.error.message);
        }

        let userData = null;

        // 1. Try to find in User table
        const user = await this.loginRepository.findByEmail(email);

        if (user) {
            const match = bcrypt.compareSync(password, user.password);
            if (match) {
                const restauranteId = await this.loginRepository.findIdRestaurantByUserId(user.id);

                userData = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.roles[0]?.name || 'user',
                    restauranteId: restauranteId
                };
            }
        }

        // 2. Try to find in Employee table
        if (!userData) {
            const employee = await this.loginRepository.findEmployeeByEmail(email);

            if (employee) {
                const match = bcrypt.compareSync(password, employee.password);
                if (match) {
                    userData = {
                        id: employee.id,
                        name: `${employee.nombre} ${employee.apellido}`,
                        email: employee.email,
                        role: employee.rol?.name || 'empleado',
                        restauranteId: employee.restaurantId
                    };
                }
            }
        }

        if (!userData) {
            throw new Error('Credenciales inválidas');
        }

        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8), // Adjusted to 8 hours as per comment in original code (though original code had 1 hour in math)
            data: userData
        }, process.env.JWT_TOKEN);

        return { token, userData };
    }
}
