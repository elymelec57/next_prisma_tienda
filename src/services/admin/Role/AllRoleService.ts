import { IAllRoleInterface } from '@/interfaces/admin/Role/AllRoleInterface';

export class AllRoleService {
    constructor(private roleRepository: IAllRoleInterface) { }

    async execute() {
        const roles = await this.roleRepository.allRoles();
        return roles;
    }
}
