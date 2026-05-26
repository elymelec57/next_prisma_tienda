import { IContorno, Contorno } from "@/interfaces/admin/Contorno/ContornoInterface";

export class StoreContornoService {
    constructor(private repository: IContorno) {}

    async execute(data: Contorno) {
        return await this.repository.create(data);
    }
}
