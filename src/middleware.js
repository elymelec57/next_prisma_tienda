import { NextResponse } from 'next/server'
import verifytoken from './libs/fecthVerifyToken'

// This function can be marked `async` if using `await` inside
export async function middleware(request) {

    const origin = request.nextUrl.origin
    const token = request.cookies.get('token')?.value

    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
        if (request.cookies.has('token')) {
            const verify = await verifytoken(origin,token)
            if (verify.status) {
                if(verify.auth.role == 'Admin'){
                    return NextResponse.redirect(new URL('/dashboard', request.url))
                }else{
                    return NextResponse.redirect(new URL('/store', request.url))
                }
            }else{
                return NextResponse.next()   
            }
        }else{
            return NextResponse.next()
        }
    }

    if (request.nextUrl.pathname.startsWith('/store')){
        if (request.cookies.has('token')) { 
            const verify = await verifytoken(origin,token)
            if (verify.status) {
                if(verify.auth.role == 'User'){
                    return NextResponse.next()
                }else{
                    return NextResponse.redirect(new URL('/dashboard', request.url))
                }
            }else{
                return NextResponse.redirect(new URL('/login', request.url))  
            }
        }else{
           return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    if (request.nextUrl.pathname.startsWith('/dashboard')){
        if (request.cookies.has('token')) {
            const verify = await verifytoken(origin,token)
            if (verify.status) {
                if(verify.auth.role == 'Admin'){
                    return NextResponse.next()
                }else{
                    return NextResponse.redirect(new URL('/store', request.url))
                }
            }else{
                return NextResponse.redirect(new URL('/login', request.url))
            }
        }else{
           return NextResponse.redirect(new URL('/login', request.url))
        }
    }
    
    if (request.cookies.has('token')) {
        const verify = await verifytoken(origin,token)
        if (!verify.status) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    } else {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register', '/store/:path*']
}