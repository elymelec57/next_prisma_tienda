import { IUser } from "@/interfaces/admin/User/UserInterface";

export class DeleteUserService {
    constructor(
        private deleteService: IUser
    ) { }

    async execute(id: number) {
        return this.deleteService.delete(id)
    }
}