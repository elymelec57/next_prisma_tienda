import { IPlan, Plan } from "@/interfaces/admin/Plan/PlanInterface";

export class UpdatePlanService {
    constructor(private repository: IPlan) {}

    async execute(id: number, data: Plan) {
        return await this.repository.update(id, data);
    }
}
