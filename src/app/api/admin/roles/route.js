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