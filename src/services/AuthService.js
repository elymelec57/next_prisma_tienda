import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export class AuthService {
    constructor(userRepository, restaurantRepository) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
    }

    async login(email, password) {
        if (!email || !password) {
            throw new Error('Enter data');
        }

        let userData = null;

        // 1. Try to find in User table
        const user = await this.userRepository.findByEmail(email);

        if (user) {
            const match = bcrypt.compareSync(password, user.password);
            if (match) {
                const restauranteId = await this.restaurantRepository.findIdByUserId(user.id);

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
            const employee = await this.userRepository.findEmployeeByEmail(email);

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

    async register(data) {
        if (data.password !== data.confirm_password) {
            throw new Error('the password does not match');
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(data.confirm_password, salt);

        const user = await this.userRepository.create({
            email: data.email,
            name: data.name,
            password: hash
        });

        if (!user || !user.id) {
            throw new Error('Error creating User');
        }

        return user;
    }
}
