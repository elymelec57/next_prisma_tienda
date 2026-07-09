import { IViewPlato } from '@/interfaces/User/Platos/ViewPlatoInterface';

export class ViewPlatoService {
    constructor(private viewPlatoRepository: IViewPlato) { }

    async getPlatosByRestaurant(restaurantId: number) {
        try {
            const currency = await this.viewPlatoRepository.getCurrency(restaurantId);
            const categorias = await this.viewPlatoRepository.findCategoriesByRestaurantId(restaurantId);
            const contornos = await this.viewPlatoRepository.AllContornos(restaurantId);
            const sucursales = await this.viewPlatoRepository.Allsucursales(restaurantId);
            return { categorias, currency, contornos, sucursales };
        } catch (error) {
            throw error;
        }
    }
}
