import { IUser, User } from "@/interfaces/admin/User/UserInterface";

export class StoreUserService {
    constructor(
        private storeUser: IUser
    ) {
    }

    async execute(data: User) {
        return this.storeUser.create(data)
    }
}