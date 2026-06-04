export class ClientService {
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }

    async getRestaurantWithClients(userId) {
        return await this.clientRepository.findRestaurantByUserId(userId);
    }
}
