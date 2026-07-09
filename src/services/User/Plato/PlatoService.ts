import { IPlato } from "@/interfaces/User/Platos/PlatoInterface";

export class PlatoService {
    constructor(private platoRepository: IPlato) { }

    async getPlatosByRestaurant(restaurantId: number) {
        const platos = await this.platoRepository.findAllByRestaurantId(restaurantId);
        const imageIds = platos.map((p) => p.mainImageId).filter((id) => id !== null);
        if (imageIds.length === 0) {
            const dataPlatos = platos.map((p) => ({ ...p, mainImage: null }));
            return { dataPlatos };
        }

        const images = await this.platoRepository.findImagesByIds(imageIds);
        const imageMap = new Map(images.map((img) => [img.id, img]));

        const dataPlatos = platos.map((plato) => ({
            ...plato,
            mainImage: plato.mainImageId ? imageMap.get(plato.mainImageId) : null,
        }));
        return { dataPlatos };
    }
}
