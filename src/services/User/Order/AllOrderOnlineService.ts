import { IAllOrderOnline } from "@/interfaces/User/Order/AllOrderOnlineInterface";

export class AllOrderOnlineService {
    constructor(
        private allOrderOnline: IAllOrderOnline,
    ) { }

    async execute(id: number, sucursalId: number | string) {
        if (sucursalId !== 'main') {
            return this.allOrderOnline.allOrderRestaurantAndSucursals(id, Number(sucursalId))
        }
        return this.allOrderOnline.allOrderOnline(id)
    }
}