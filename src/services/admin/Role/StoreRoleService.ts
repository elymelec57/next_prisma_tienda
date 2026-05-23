import { IRole, Role } from "@/interfaces/admin/Role/RoleInterface";

export class StoreRoleService {
    constructor(
        private storeRole: IRole
    ) {
    }

    async execute(data: Role) {
        return this.storeRole.create(data)
    }
}
