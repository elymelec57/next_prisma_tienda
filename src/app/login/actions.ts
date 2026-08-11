'use server'

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { LoginService } from '@/services/Auth/LoginService';
import { LoginRepository } from '@/repositories/Auth/LoginRepository';

const loginRepository = new LoginRepository();
const loginService = new LoginService(loginRepository);

/**
 * Server Action para el login.
 *
 * Ejecuta el LoginService (Interface → Repository → Prisma),
 * persiste el JWT como cookie httpOnly y devuelve un redirect
 * de servidor basado en el rol del usuario.
 *
 * Si las credenciales son inválidas devuelve { error: string }
 * para que el cliente lo muestre sin hacer ningún redirect.
 */
export async function loginAction(
    email: string,
    password: string,
): Promise<{ error: string }> {
    let redirectUrl: string;

    try {
        const { token, userData } = await loginService.execute(email, password);

        const cookieStore = await cookies();
        cookieStore.set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
        });

        // Determinar destino según el rol
        const role = userData.role;
        if (role === 'Mesero') {
            redirectUrl = '/panel/pedidos-mesero';
        } else if (role === 'Caja') {
            redirectUrl = '/panel/caja';
        } else if (role === 'Cocina') {
            redirectUrl = '/panel/orders';
        } else {
            redirectUrl = '/panel';
        }
    } catch (error: any) {
        // Devolver el error para que el componente cliente lo muestre
        return { error: error.message ?? 'Error al iniciar sesión' };
    }

    // redirect() lanza una excepción internamente, debe estar fuera del try/catch
    redirect(redirectUrl);
}
