import { IPlan } from "@/interfaces/admin/Plan/PlanInterface";

export class GetPlanService {
    constructor(private repository: IPlan) {}

    async execute(id: number) {
        return await this.repository.findById(id);
    }
}
