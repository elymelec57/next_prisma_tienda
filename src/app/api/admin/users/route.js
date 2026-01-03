import { NextResponse } from "next/server"
import { prisma } from '@/libs/prisma';

export async function GET(request) {
    try {
        const users = await prisma.user.findMany({
            where:{
                roles:{
                    some: { name: 'User' }
                }
            },
        });
        return NextResponse.json({status: true, users })        
    } catch (error) {
        return NextResponse.json({ status: false , message: error})
    }
}