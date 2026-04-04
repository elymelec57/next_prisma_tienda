import { NextResponse } from 'next/server'
import verifytoken from './libs/fecthVerifyToken'

// Lista de orígenes permitidos (Vue App y el propio Next App)
const allowedOrigins = [
    "https://elymelec57.github.io",
    "http://localhost:6001",
];

// This function can be marked `async` if using `await` inside
export async function middleware(request) {

    const { pathname } = request.nextUrl;

    // 1. Configuración de CORS
    const origin = request.headers.get("origin");

    // Verificar si el origen es permitido, si no hay origen (mismo servidor) lo permitimos o 'null'
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    if (request.method === 'OPTIONS') {
        if (isAllowedOrigin) {
            return new NextResponse(null, {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Allow-Credentials': 'true',
                },
            });
        }
        // Si no, dejamos pasar o bloqueamos (opcional), aquí dejamos pasar estándar
        return new NextResponse(null, { status: 204 });
    }

    // 2. Ejecutar lógica existente (Autenticación, Redirecciones, etc.)
    const originNext = request.nextUrl.origin
    const token = request.cookies.get('token')?.value

    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        if (request.cookies.has('token')) {
            const verify = await verifytoken(originNext, token)
            if (verify.status) {
                // Si el rol es 'user' (dueño), redirigir al Dashboard, si no al Perfil (seguro para todos)
                if (verify.auth.role.toLowerCase() === 'user') {
                    return NextResponse.redirect(new URL('/store', request.url))
                } else {
                    return NextResponse.redirect(new URL('/store/profile', request.url))
                }
            } else {
                return NextResponse.next()
            }
        } else {
            return NextResponse.next()
        }
    }

    if (pathname.startsWith('/store')) {
        if (request.cookies.has('token')) {
            const verify = await verifytoken(originNext, token, pathname)
            if (verify.status) {
                if (verify.authorized === false) {
                    const referer = request.headers.get('referer');
                    // Si viene de otra página interna, regresarlo allá
                    if (referer && referer.includes(originNext) && !referer.endsWith(pathname)) {
                        return NextResponse.redirect(new URL(referer, request.url))
                    }
                    // Si no hay referer válido, mandarlo a su perfil
                    return NextResponse.redirect(new URL('/store/profile', request.url))
                }
                return NextResponse.next()
            } else {
                return NextResponse.redirect(new URL('/login', request.url))
            }
        } else {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    if (request.cookies.has('token')) {
        const verify = await verifytoken(originNext, token)
        if (!verify.status) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    } else {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/login', '/register', '/store/:path*']
    //matcher: ['/api/:path*']
}
