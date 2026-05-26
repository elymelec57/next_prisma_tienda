import { IRol, Rol } from "@/interfaces/admin/Rol/RolInterface";

export class StoreRolService {
    constructor(private repository: IRol) {}

    async execute(data: Rol) {
        return await this.repository.create(data);
    }
}
