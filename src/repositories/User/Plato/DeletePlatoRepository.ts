import { prisma } from "@/libs/prisma";

export class DeletePlatoRepository {
    async delete(id) {
        return await prisma.plato.delete({
            where: {
                id: Number(id)
            },
        });
    }

    async deleteImage(id) {
        return await prisma.image.delete({
            where: {
                id: id
            }
        });
    }
}
