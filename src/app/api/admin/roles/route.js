import { NextResponse } from "next/server"
import { prisma } from '@/libs/prisma';

export async function GET(request) {
    try {
        const roles = await prisma.rolUser.findMany();
        return NextResponse.json({status: true, roles })        
    } catch (error) {
        return NextResponse.json({ status: false , message: error})
    }
}

export async function POST(request) {
    const rol = await request.json()

    try {
        await prisma.rolUser.create({
            data:{
                name: rol.name,
            }
        })

        return NextResponse.json({status: true})
    } catch (error) {
        return NextResponse.json({status: true, message: error})
    }
}


export async function PUT(request) {
    const rol = await request.json()

    try {
        await prisma.rolUser.update({
            where:{
                id: rol.id
            },
            data:{
                name: rol.name,
            }
        })

        return NextResponse.json({status: true})
    } catch (error) {
        return NextResponse.json({status: true, message: error})
    }
}