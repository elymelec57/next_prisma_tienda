import { IRol } from "@/interfaces/admin/Rol/RolInterface";

export class DeleteRolService {
    constructor(private repository: IRol) {}

    async execute(id: number) {
        return await this.repository.delete(id);
    }
}
