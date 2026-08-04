import { IGetClientsRepository } from "@/interfaces/User/Clients/GetClientsInterface";

export class ClientService {
    constructor(private clientRepository: IGetClientsRepository) {
    }

    async getRestaurantWithClients(userId: number) {
        return await this.clientRepository.findRestaurantByUserId(userId);
    }
}
