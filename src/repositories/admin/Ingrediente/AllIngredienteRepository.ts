import { prisma } from "@/libs/prisma";
import { IAllIngrediente } from "@/interfaces/admin/Ingrediente/IngredienteInterface";

export class AllIngredienteRepository implements IAllIngrediente {
    async all(): Promise<any[]> {
        return await prisma.ingrediente.findMany({
            include: { categoriaIngrediente: true }
        });
    }
}
