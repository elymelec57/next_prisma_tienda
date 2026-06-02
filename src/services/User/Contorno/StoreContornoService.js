export class StoreContornoService {
    constructor(storeRepository) {
        this.storeRepository = storeRepository;
    }

    async execute(form, userId) {
        const rest = await this.storeRepository.RestaurantByUserId(userId);
        if (!rest) {
            throw new Error('Restaurante no encontrado');
        }

        const contorno = await this.storeRepository.create({
            nombre: form.name,
            price: Number(form.price),
            restaurantId: rest.id,
        });

        if (!contorno) {
            throw new Error('Ocurrió un error inesperado');
        }

        return contorno;
    }
}
