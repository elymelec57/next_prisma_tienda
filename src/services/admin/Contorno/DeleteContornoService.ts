import { IContorno } from "@/interfaces/admin/Contorno/ContornoInterface";

export class DeleteContornoService {
    constructor(private repository: IContorno) {}

    async execute(id: number) {
        return await this.repository.delete(id);
    }
}
