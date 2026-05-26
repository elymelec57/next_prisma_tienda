import { IContorno, Contorno } from "@/interfaces/admin/Contorno/ContornoInterface";

export class UpdateContornoService {
    constructor(private repository: IContorno) {}

    async execute(id: number, data: Contorno) {
        return await this.repository.update(id, data);
    }
}
