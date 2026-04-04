import { NextResponse } from 'next/server'
import { prisma } from '../../../../libs/prisma.js'
import slugify from 'slugify';

export async function GET () {
  try {
    const restaurantes = await prisma.restaurant.findMany()
    return NextResponse.json({status: true, restaurantes})
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST (request) {
  try {
    const { slug, name, slogan, phone, direcction, userId, categoriaRestaurant, paymentMethods } = await request.json()
    const newRestaurante = await prisma.restaurant.create({
      data: {
        slug,
        name,
        slogan,
        phone,
        direcction,
        user: {
          connect: {
            id: userId
          }
        },
        categoriaRestaurant: {
          connect: categoriaRestaurant.map(id => ({ id }))
        },
        paymentMethods: {
          connect: paymentMethods.map(id => ({ id }))
        }
      }
    })
    return NextResponse.json({status: true})
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT (request, { params }) {
  try {
    const { name, slogan, phone, direcction, id } = await request.json()

    const slug = slugify(name, {
            lower: true,      // Convierte a minúsculas
            strict: true,     // Elimina caracteres no válidos
            remove: /[*+~.()'"!:@]/g // Elimina caracteres especiales
        });

    const updatedRestaurante = await prisma.restaurant.update({
      where: {
        id: id
      },
      data: {
        slug,
        name,
        slogan,
        phone,
        direcction,
        // user: {
        //   connect: {
        //     id: userId
        //   }
        // },
        // categoriaRestaurant: {
        //   set: categoriaRestaurant.map(id => ({ id }))
        // },
        // paymentMethods: {
        //   set: paymentMethods.map(id => ({ id }))
        // }
      }
    })
    return NextResponse.json({status: true})
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}