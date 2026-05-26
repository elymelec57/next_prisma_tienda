import { ICategoria } from "@/interfaces/admin/Categoria/CategoriaInterface";

export class GetCategoriaService {
    constructor(private repository: ICategoria) {}

    async execute(id: number) {
        return await this.repository.findById(id);
    }
}
