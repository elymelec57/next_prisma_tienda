import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function DELETE(request, segmentData) {
    const params = await segmentData.params
    try {
        const user = await prisma.user.delete({
            where: {
                id: Number(params.id)
            }
        });
        return NextResponse.json({status: true }) 
    } catch (error) {
        return NextResponse.json({ status: false , message: error})
    }
}