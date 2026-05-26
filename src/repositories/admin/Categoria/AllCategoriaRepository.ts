import { prisma } from "@/libs/prisma";
import { IAllCategoria } from "@/interfaces/admin/Categoria/CategoriaInterface";

export class AllCategoriaRepository implements IAllCategoria {
    async all(): Promise<any[]> {
        return await prisma.categoria.findMany();
    }
}
