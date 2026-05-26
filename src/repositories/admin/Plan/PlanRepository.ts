import { prisma } from "@/libs/prisma";
import { IPlan, Plan } from "@/interfaces/admin/Plan/PlanInterface";

export class PlanRepository implements IPlan {
    async create(data: Plan) {
        return await prisma.plan.create({
            data: {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                duration: Number(data.duration)
            }
        });
    }

    async update(id: number, data: Plan) {
        return await prisma.plan.update({
            where: { id: Number(id) },
            data: {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                duration: Number(data.duration)
            }
        });
    }

    async delete(id: number) {
        return await prisma.plan.delete({
            where: { id: Number(id) }
        });
    }

    async findById(id: number) {
        return await prisma.plan.findUnique({
            where: { id: Number(id) }
        });
    }
}
