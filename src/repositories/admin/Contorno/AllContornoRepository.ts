import { prisma } from "@/libs/prisma";
import { IAllContorno } from "@/interfaces/admin/Contorno/ContornoInterface";

export class AllContornoRepository implements IAllContorno {
    async all(): Promise<any[]> {
        return await prisma.contorno.findMany();
    }
}
