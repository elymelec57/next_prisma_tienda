import { IAllRol } from "@/interfaces/admin/Rol/RolInterface";

export class AllRolService {
    constructor(private repository: IAllRol) {}

    async execute() {
        return await this.repository.all();
    }
}
