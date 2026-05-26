import { IRol, Rol } from "@/interfaces/admin/Rol/RolInterface";

export class UpdateRolService {
    constructor(private repository: IRol) {}

    async execute(id: number, data: Rol) {
        return await this.repository.update(id, data);
    }
}
