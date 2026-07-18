export class ContornoService {
    constructor(contornoRepository, restaurantRepository) {
        this.contornoRepository = contornoRepository;
        this.restaurantRepository = restaurantRepository;
    }

    async getContornosByRestaurant(restaurantId) {
        const contornos = await this.contornoRepository.findAllByRestaurantId(restaurantId);
        return { contornos };
    }

    async getContornoById(id) {
        const contorno = await this.contornoRepository.findById(id);
        if (!contorno) {
            throw new Error('Contorno no encontrado');
        }
        const currency = await this.restaurantRepository.getCurrency(contorno.restaurantId);
        return { contorno, currency };
    }
}
