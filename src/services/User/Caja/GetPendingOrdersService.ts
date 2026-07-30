import { IGetPendingOrders } from '@/interfaces/User/Caja/GetPendingOrdersInterface';

export class GetPendingOrdersService {
    constructor(private getPendingOrdersRepository: IGetPendingOrders) { }

    async execute(restaurantId: number): Promise<any[]> {
        return this.getPendingOrdersRepository.getPendingOrders(restaurantId);
    }
}
