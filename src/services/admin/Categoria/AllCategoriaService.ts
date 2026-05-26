import { IAllCategoria } from "@/interfaces/admin/Categoria/CategoriaInterface";

export class AllCategoriaService {
    constructor(private repository: IAllCategoria) {}

    async execute() {
        return await this.repository.all();
    }
}
