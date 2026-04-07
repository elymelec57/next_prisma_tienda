import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function POST(request) {

    const { form, user } = await request.json()

    // user is an object containing auth data, id is user.auth.id
    const userId = typeof user === 'object' ? user.auth.id : Number(user);

    const rest = await prisma.restaurant.findUnique({
        where: {
            userId: userId
        },
        select: {
            id: true,
            subscription: {
                include: {
                    plan: true
                }
            },
            _count: {
                select: {
                    platos: true
                }
            }
        }
    })

    if (!rest) {
        return NextResponse.json({ status: false, message: 'Restaurante no encontrado' })
    }

    // Default to 'Gratis' plan limit if no subscription is found
    const currentPlatos = rest._count.platos;
    const planLimit = rest.subscription?.plan?.productLimit || 10; // Default limit for free plan if no sub

    if (currentPlatos >= planLimit) {
        return NextResponse.json({
            status: false,
            message: `Has alcanzado el límite de productos (${planLimit}) para tu plan actual. Por favor, mejora tu plan.`
        })
    }

    const plato = await prisma.plato.create({
        data: {
            nombre: form.name,
            descripcion: form.description,
            precio: Number(form.price),
            disponible: true,
            restaurant: {
                connect: {
                    id: rest.id,
                },
            },
            categoria: {
                connect: {
                    id: Number(form.categoryId),
                }
            },
            contornos: {
                connect: form.contornos ? form.contornos.map(id => ({ id: Number(id) })) : []
            }
        },
        include: {
            restaurant: true,
            categoria: true,
        },
    });

    if (plato) {
        return NextResponse.json({ status: true, message: 'Plato creado con exito', id: plato.id })
    }
    return NextResponse.json({ status: false, message: 'Ocurrio en error inesperado' })
}