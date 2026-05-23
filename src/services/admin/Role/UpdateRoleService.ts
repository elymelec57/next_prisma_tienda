import { IRole, Role } from "@/interfaces/admin/Role/RoleInterface";

export class UpdateRoleService {
    constructor(
        private updateRole: IRole
    ) {
    }

    async execute(id: number, data: Role) {
        return await this.updateRole.update(id, data)
    }
}
