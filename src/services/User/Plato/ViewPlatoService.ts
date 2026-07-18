import { IViewPlato } from '@/interfaces/User/Platos/ViewPlatoInterface';

export class ViewPlatoService {
    constructor(private viewPlatoRepository: IViewPlato) { }

    async getPlatosByRestaurant(restaurantId: number, sucursalId: number | string) {
        try {
            const categorias = await this.viewPlatoRepository.findCategoriesByRestaurantId(restaurantId);
            let contornos = [];
            if (sucursalId === 'main') {
                contornos = await this.viewPlatoRepository.AllContornos(restaurantId);
            } else {
                contornos = await this.viewPlatoRepository.AllContornosSucursalId(restaurantId, sucursalId);
            }

            return { categorias, contornos };
        } catch (error) {
            throw error;
        }
    }
}
