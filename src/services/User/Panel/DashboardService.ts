import { IDashboardUserInterface } from '@/interfaces/User/Panel/DashboardInterface';

export class DashboardService {

    constructor(
        private dashboardData: IDashboardUserInterface,
    ) { }

    async execute(id) {
        return this.dashboardData.dashboardUser(id)
    }
}