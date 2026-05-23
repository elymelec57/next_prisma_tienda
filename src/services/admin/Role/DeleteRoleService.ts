import { IRole } from "@/interfaces/admin/Role/RoleInterface";

export class DeleteRoleService {
    constructor(
        private deleteRole: IRole
    ) {
    }

    async execute(id: number) {
        return await this.deleteRole.delete(id)
    }
}
