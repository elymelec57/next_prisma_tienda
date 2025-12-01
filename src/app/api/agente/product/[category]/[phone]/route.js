import { prisma } from "@/libs/prisma";
import { NextResponse } from 'next/server';

export async function GET(request,segmentData) {
  try {
    
    const params  = await segmentData.params;
    //return NextResponse.json(phone)
    if (!params.phone && !params.category) {
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

    // consulto el id de la categoria
    const category = await prisma.category.findFirst({
      where:{
        name: params.category
      }
    });

    // consulta de los producto segun la categoria
    const products = await prisma.product.findMany({
        where:{
          userId: business.userId,
          categoryId: category.id
        },
        select:{
          name: true,
          price: true
        },
    })

    const path = `https://next-tienda.vercel.app/${business.slug}/category/${category.name}`
    
    return NextResponse.json({productos:products, path },{ status: 200 });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    //await prisma.$disconnect();
  }
}