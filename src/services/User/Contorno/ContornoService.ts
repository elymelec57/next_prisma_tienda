import { IAllContornos } from '@/interfaces/User/Contornos/AllContornosInterface';

export class ContornoService {
    constructor(private contornoRepository: IAllContornos) {
    }

    async getContornosByRestaurant(restaurantId, sucursalId) {
        let contornos;
        if (sucursalId != 'main') {
            contornos = await this.contornoRepository.findAllByRestaurantIdAndSucursalId(restaurantId, sucursalId);
        } else {
            contornos = await this.contornoRepository.findAllByRestaurantId(restaurantId);
        }
        return { contornos };
    }

    async getContornoById(id) {
        const contorno = await this.contornoRepository.findById(id);
        if (!contorno) {
            throw new Error('Contorno no encontrado');
        }
        return { contorno };
    }
}
