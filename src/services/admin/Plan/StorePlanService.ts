import { IPlan, Plan } from "@/interfaces/admin/Plan/PlanInterface";

export class StorePlanService {
    constructor(private repository: IPlan) {}

    async execute(data: Plan) {
        return await this.repository.create(data);
    }
}
