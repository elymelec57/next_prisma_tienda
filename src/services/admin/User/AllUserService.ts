import { IAllUserInterface } from '@/interfaces/admin/User/AllUserInterface';

export class AllUserService {
    constructor(private userRepository: IAllUserInterface) { }

    async execute() {
        const [users, roles] = await Promise.all([
            this.userRepository.allUsers(),
            this.userRepository.roleUsers()
        ]);
        return { users, roles };
    }
}
