import { prisma } from "@/libs/prisma";
import { IAllPlan } from "@/interfaces/admin/Plan/PlanInterface";

export class AllPlanRepository implements IAllPlan {
    async all(): Promise<any[]> {
        return await prisma.plan.findMany();
    }
}
