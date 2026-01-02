import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import deleteImage from "@/libs/deleteImage";

export async function GET(request, segmentData) {
    const params = await segmentData.params
    const plato = await prisma.plato.findUnique({
        where: {
            id: Number(params.id)
        },
        include: {
            contornos: true
        }
    });

    if (plato.mainImageId != null) {
        const image = await prisma.image.findUnique({
            where: {
                id: plato.mainImageId
            },
            select: {
                id: true,
                url: true
            }
        });
        plato.url = image.url
    } else {
        plato.url = null
    }

    return NextResponse.json({ plato })
}

export async function PUT(request, segmentData) {
    const params = await segmentData.params
    const { form } = await request.json()

    const plato = await prisma.plato.update({
        where: {
            id: Number(params.id)
        },
        data: {
            nombre: form.name,
            descripcion: form.description,
            precio: Number(form.price),
            categoriaId: Number(form.categoryId),
            contornos: {
                set: form.contornos ? form.contornos.map(id => ({ id: Number(id) })) : []
            }
        }
    });

    if (plato) {
        return NextResponse.json({ status: true, message: "Plato editado correctamente", id: plato.id, mainImage: plato.mainImageId })
    }
    return NextResponse.json({ status: false, message: "Error al editar" })
}

export async function DELETE(request, segmentData) {
    try {
        const params = await segmentData.params

        const platoDelete = await prisma.plato.delete({
            where: {
                id: Number(params.id)
            },
        });

        if (platoDelete) {
            const image = await prisma.image.delete({
                where: {
                    id: platoDelete.mainImageId
                }
            })

            const blog = await deleteImage(image.url)

            if (blog.status) {
                return NextResponse.json({ status: true, message: "Eliminado correctamente" })
            }
        }

    } catch (error) {
        console.log("Error:", error)
        return NextResponse.json({ status: false, message: error, })
    }
}