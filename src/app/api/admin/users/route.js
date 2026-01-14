import { NextResponse } from "next/server"
import { prisma } from '@/libs/prisma';
import bcrypt from 'bcryptjs';

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

export async function POST(request){
    const data = await request.json()
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(data.password, salt);

        const users = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hash,
                roles: {
                    connect: {id: 2} //roles.map((role) => ({ userId: role.id })),
                },
            },
        });
        return NextResponse.json({status: true, users }) 
    } catch (error) {
        return NextResponse.json({ status: false , message: error})
    }
}

export async function PUT(request){
    const data = await request.json()
    
    try {

        if(data.password !== undefined){
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(data.password, salt);

            const user = await prisma.user.update({
                where:{
                    id: data.id
                },
                data:{
                    email: data.email,
                    name: data.name,
                    password: hash,
                }
            })  
        }else{
            const user = await prisma.user.update({
                where:{
                    id: data.id
                },
                data:{
                    email: data.email,
                    name: data.name,
                }
            })
        }   

        return NextResponse.json({status: true }) 
    } catch (error) {
        return NextResponse.json({ status: false , message: error})
    }
}