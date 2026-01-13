import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'

export async function POST(request) {
    const { form } = await request.json()
    const cookieStore = await cookies()

    if (form.email === '' || form.password === '') {
        return NextResponse.json({ status: false, message: 'Enter data' })
    }

    // 1. Intentar buscar en la tabla de Usuarios (Administradores/Dueños)
    let authenticatedUser = await prisma.user.findUnique({
        where: { email: form.email },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
            roles: { select: { name: true } },
        },
    });

    let userData = null;

    if (authenticatedUser) {
        const match = bcrypt.compareSync(form.password, authenticatedUser.password);
        if (match) {
            const restaurante = await prisma.restaurant.findUnique({
                where: { userId: authenticatedUser.id },
                select: { id: true },
            });

            userData = {
                id: authenticatedUser.id,
                name: authenticatedUser.name,
                email: authenticatedUser.email,
                role: authenticatedUser.roles[0]?.name || 'user',
                restauranteId: restaurante?.id || null
            };
        }
    }

    // 2. Si no se encontró en User, buscar en la tabla de Empleados

    if (!userData) {
        const employee = await prisma.empleado.findUnique({
            where: { email: form.email },
            include: { rol: true }
        });

        if (employee) {
            const match2 = bcrypt.compareSync(form.password, employee.password);
            if (match2) {
                userData = {
                    id: employee.id, // ID del empleado (o podrías usar un prefijo si es necesario)
                    name: `${employee.nombre} ${employee.apellido}`,
                    email: employee.email,
                    role: employee.rol?.nombre || 'empleado',
                    restauranteId: employee.restaurantId
                };
            }
        }
    }

    if (userData) {
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 1), // 8 horas de sesión
            data: userData
        }, process.env.JWT_TOKEN);

        cookieStore.set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
        });

        return NextResponse.json({ status: true, message: 'login successfully', auth: userData })
    }

    return NextResponse.json({ status: false, message: 'Credenciales inválidas' })
}