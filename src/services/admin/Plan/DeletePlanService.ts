import { IPlan } from "@/interfaces/admin/Plan/PlanInterface";

export class DeletePlanService {
    constructor(private repository: IPlan) {}

    async execute(id: number) {
        return await this.repository.delete(id);
    }
}
