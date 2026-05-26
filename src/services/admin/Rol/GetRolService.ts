import { IRol } from "@/interfaces/admin/Rol/RolInterface";

export class GetRolService {
    constructor(private repository: IRol) {}

    async execute(id: number) {
        return await this.repository.findById(id);
    }
}
