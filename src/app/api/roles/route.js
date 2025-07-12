import { NextResponse } from "next/server";
import {prisma} from '@/libs/prisma'

export async function POST(request){
    const { form } = await request.json()

    const res = await prisma.rol.create({
        data:{
            name: form.name
        },
    });

    if(res){
        return NextResponse.json({status: true, message: 'rol create successfulli'})
    }else{
        return NextResponse.json({status: true, message: 'Error create rol'})
    }
}