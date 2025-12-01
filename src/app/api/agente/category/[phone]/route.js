import { prisma } from "@/libs/prisma";
import { NextResponse } from 'next/server';

export async function GET(request, segmentData) {
  try { 
    const params = await segmentData.params;
    
    if (!params.phone) {
      return NextResponse.json({ message: 'Phone parameter is missing' }, { status: 400 });
    }

    // Find the business by phone number
    const business = await prisma.business.findFirst({
      where: {
        phone: params.phone,
      },
    });

    if (!business) {
      return NextResponse.json({ message: 'Business not found for the given phone number' }, { status: 404 });
    }

    //categorias en uso por la tienda, no mostraremos categorias que no posea producto por la tienda
    const categoriesCurrent = await prisma.category.findMany({
      where: {
        products: {
          some: {
            userId: Number(business.userId), // Products associated with the user linked to this business
          },
        },
      },
    });

    //Find categories that have at least one product belonging to this business
    const product = await prisma.category.findMany({
      where: {
        products: {
          some: {
            userId: Number(business.userId), // Products associated with the user linked to this business
          },
        },
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true
          },
        }
      }
    });

    product.forEach(element => {
        element.url = request.nextUrl.origin + `/${business.slug}/${element.name}`
    });

    return NextResponse.json({categorias: categoriesCurrent, productos: product}, { status: 200 });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}