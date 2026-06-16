import { IAllOrderOnline } from "@/interfaces/User/Order/AllOrderOnlineInterface";

export class AllOrderOnlineService {
    constructor(
        private allOrderOnline: IAllOrderOnline,
    ) { }

    async execute(id: number) {
        return this.allOrderOnline.allOrderOnline(id)
    }
}