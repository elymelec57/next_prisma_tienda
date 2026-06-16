import { IFindOrderById } from "@/interfaces/User/Order/FindOrderByIdInterface";

export class FindOrderByIdService {
    constructor(
        private findOrderById: IFindOrderById,
    ) { }

    async execute(id: number) {
        return this.findOrderById.findOrderById(id);
    }
}
