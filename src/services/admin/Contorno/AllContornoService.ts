import { IAllContorno } from "@/interfaces/admin/Contorno/ContornoInterface";

export class AllContornoService {
    constructor(private repository: IAllContorno) {}

    async execute() {
        return await this.repository.all();
    }
}
