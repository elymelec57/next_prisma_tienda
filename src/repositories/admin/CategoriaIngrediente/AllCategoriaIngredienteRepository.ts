import { prisma } from "@/libs/prisma";
import { IAllCategoriaIngrediente } from "@/interfaces/admin/CategoriaIngrediente/CategoriaIngredienteInterface";

export class AllCategoriaIngredienteRepository implements IAllCategoriaIngrediente {
    async all(): Promise<any[]> {
        return await prisma.categoriaIngrediente.findMany();
    }
}
