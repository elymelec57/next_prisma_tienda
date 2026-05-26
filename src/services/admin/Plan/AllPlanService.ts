import { IAllPlan } from "@/interfaces/admin/Plan/PlanInterface";

export class AllPlanService {
    constructor(private repository: IAllPlan) {}

    async execute() {
        return await this.repository.all();
    }
}
