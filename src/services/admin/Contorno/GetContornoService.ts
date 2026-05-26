import { IContorno } from "@/interfaces/admin/Contorno/ContornoInterface";

export class GetContornoService {
    constructor(private repository: IContorno) {}

    async execute(id: number) {
        return await this.repository.findById(id);
    }
}
